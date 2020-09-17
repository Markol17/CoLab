import { ProjectSkill } from '../entities/ProjectSkill';
import { Skill } from '../entities/Skill';
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Project } from '../entities/Project';
import { User } from '../entities/User';
import { isAuth } from '../middleware/isAuth';
import { Context } from '../types';
import { ProjectCategory } from '../entities/ProjectCategory';
import { Category } from '../entities/Category';
import { validateCreateProject } from '../utils/validateCreateProject';
import { FieldError } from './user';

@InputType()
export class ProjectInput {
  @Field()
  name: string;
  @Field()
  desc: string;
}

@ObjectType()
class PaginatedProjects {
  @Field(() => [Project])
  projects: Project[];
  @Field()
  hasMore: boolean;
}
@ObjectType()
class ProjectResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Project, { nullable: true })
  project?: Project;
}

@Resolver(Project)
export class ProjectResolver {
  @FieldResolver(() => User)
  creator(@Root() project: Project, @Ctx() { userLoader }: Context) {
    return userLoader.load(project.creatorId);
  }

  //TODO: implement addPoint
  // @Mutation(() => Boolean)
  // @UseMiddleware(isAuth)
  // async addPoint(
  //   @Arg('projectId', () => Int) projectId: number,
  //   @Arg('value', () => Int) value: number,
  //   @Ctx() { req }: Context
  // ) {
  //   const isUpdoot = value !== -1;
  //   const realValue = isUpdoot ? 1 : -1;
  //   const { userId } = req.session;

  //   const updoot = await Updoot.findOne({ where: { projectId, userId } });

  //   // the user has voted on the post before
  //   // and they are changing their vote
  //   if (updoot && updoot.value !== realValue) {
  //     await getConnection().transaction(async (tm) => {
  //       await tm.query(
  //         `
  //         update updoot
  //         set value = $1
  //         where "postId" = $2 and "userId" = $3
  //       `,
  //         [realValue, projectId, userId]
  //       );

  //       await tm.query(
  //         `
  //         update post
  //         set points = points + $1
  //         where id = $2
  //       `,
  //         [2 * realValue, projectId]
  //       );
  //     });
  //   } else if (!updoot) {
  //     // has never voted before
  //     await getConnection().transaction(async (tm) => {
  //       await tm.query(
  //         `
  //         insert into updoot ("userId", "postId", value)
  //         values ($1, $2, $3)
  //       `,
  //         [userId, postId, realValue]
  //       );

  //       await tm.query(
  //         `
  //         update post
  //         set points = points + $1
  //         where id = $2
  //     `,
  //         [realValue, postId]
  //       );
  //     });
  //   }
  //   return true;
  // }

  @Query(() => PaginatedProjects)
  async paginatedProjects(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedProjects> {
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const projects = await getConnection().query(
      `
      select p.*
      from project p
      ${cursor ? `where p."createdAt" < $2` : ''}
      order by p."createdAt" DESC
      limit $1
    `,
      replacements
    );

    return {
      projects: projects.slice(0, realLimit),
      hasMore: projects.length === reaLimitPlusOne,
    };
  }

  @Query(() => Project, { nullable: true })
  project(@Arg('id', () => Int) id: number): Promise<Project | undefined> {
    return Project.findOne(id);
  }

  @Mutation(() => ProjectResponse)
  @UseMiddleware(isAuth)
  async createProject(
    @Arg('input') input: ProjectInput,
    @Arg('skillIds', () => [Int]) skillIds: number[],
    @Arg('categoryIds', () => [Int]) categoryIds: number[],
    @Ctx() { req }: Context
  ): Promise<ProjectResponse> {
    const errors = validateCreateProject(input, skillIds, categoryIds);
    if (errors) {
      return { errors };
    }

    const project = await Project.create({
      ...input,
      creatorId: req.session.userId,
    }).save();

    let sIds: { projectId: number; skillId: number }[] = [];
    skillIds.forEach((_id, index) => {
      sIds.push({ projectId: project.id, skillId: skillIds[index] });
    });
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(ProjectSkill)
      .values(sIds)
      .execute();

    let cIds: { projectId: number; categoryId: number }[] = [];
    categoryIds.forEach((_id, index) => {
      cIds.push({ projectId: project.id, categoryId: categoryIds[index] });
    });
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(ProjectCategory)
      .values(cIds)
      .execute();

    return project;
  }

  //TODO: create and move to skill resolver
  @Mutation(() => Skill)
  async createSkill(@Arg('type') type: string) {
    return Skill.create({ type }).save();
  }

  //TODO: create and move to category resolver
  @Mutation(() => Category)
  async createCategory(@Arg('name') name: string) {
    return Category.create({ name }).save();
  }

  //TODO: support updating skills and categories
  @Mutation(() => Project, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg('name') name: string,
    @Arg('desc') desc: string,
    @Ctx() { req }: Context
  ): Promise<Project | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Project)
      .set({ name, desc })
      .where('id = :id and "creatorId" = :creatorId', {
        id,
        creatorId: req.session.userId,
      })
      .returning('*')
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteProject(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: Context
  ): Promise<boolean> {
    //TODO: cascade delete
    await Project.delete({ id, creatorId: req.session.userId });
    return true;
  }
}
