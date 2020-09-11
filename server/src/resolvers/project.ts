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
// import { Skill } from '../entities/Skill';
import { User } from '../entities/User';
import { isAuth } from '../middleware/isAuth';
import { Context } from '../types';

@InputType()
class ProjectInput {
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

@Resolver(Project)
export class ProjectResolver {
  @FieldResolver(() => User)
  creator(@Root() project: Project, @Ctx() { userLoader }: Context) {
    return userLoader.load(project.creatorId);
  }

  // @Mutation(() => Boolean)
  // @UseMiddleware(isAuth)
  // async star(
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
    // 20 -> 21
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const projects = await getConnection().query(
      `
      select p.*, s.type, c.name
      from project p
      ${cursor ? `where p."createdAt" < $2` : ''}
      left join project_skills_skill pss on p.id = pss."projectId"
      left join skill s on pss."skillId" = s.id
      left join project_categories_category pcc on p.id = pcc."projectId"
      left join category c on pcc."categoryId" = c.id 
      order by p."createdAt" DESC
      limit $1
    `,
      replacements
    );
    console.log(projects);
    // const qb = getConnection()
    //   .getRepository(Post)
    //   .createQueryBuilder("p")
    //   .innerJoinAndSelect("p.creator", "u", 'u.id = p."creatorId"')
    //   .orderBy('p."createdAt"', "DESC")
    //   .take(reaLimitPlusOne);

    // if (cursor) {
    //   qb.where('p."createdAt" < :cursor', {
    //     cursor: new Date(parseInt(cursor)),
    //   });
    // }

    // const posts = await qb.getMany();
    // console.log("posts: ", posts);

    return {
      projects: projects.slice(0, realLimit),
      hasMore: projects.length === reaLimitPlusOne,
    };
  }

  @Query(() => Project, { nullable: true })
  project(@Arg('id', () => Int) id: number): Promise<Project | undefined> {
    return Project.findOne(id);
  }

  @Mutation(() => Project)
  @UseMiddleware(isAuth)
  async createProject(
    @Arg('input') input: ProjectInput,
    @Ctx() { req }: Context
  ): Promise<Project> {
    return Project.create({
      ...input,
      creatorId: req.session.userId,
    }).save();
  }

  // @Mutation(() => Post, { nullable: true })
  // @UseMiddleware(isAuth)
  // async updatePost(
  //   @Arg('id', () => Int) id: number,
  //   @Arg('title') title: string,
  //   @Arg('text') text: string,
  //   @Ctx() { req }: Context
  // ): Promise<Post | null> {
  //   const result = await getConnection()
  //     .createQueryBuilder()
  //     .update(Post)
  //     .set({ title, text })
  //     .where('id = :id and "creatorId" = :creatorId', {
  //       id,
  //       creatorId: req.session.userId,
  //     })
  //     .returning('*')
  //     .execute();

  //   return result.raw[0];
  // }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteProject(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: Context
  ): Promise<boolean> {
    // not cascade way
    // const post = await Post.findOne(id);
    // if (!post) {
    //   return false;
    // }
    // if (post.creatorId !== req.session.userId) {
    //   throw new Error("not authorized");
    // }

    // await Updoot.delete({ postId: id });
    // await Post.delete({ id });

    await Project.delete({ id, creatorId: req.session.userId });
    return true;
  }
}
