import { Arg, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
import { Project } from '../entities/Project';
import { User } from '../entities/User';
import { isAuth } from '../middleware/isAuth';
import { Context } from '../types';
import { ProjectService } from '../services/ProjectService';
import { JoinProjectResponse, PaginatedProjects, ProjectResponse } from './ResponseTypes/ProjectResponse';
import { CreateProjectInput } from './InputTypes/ProjectInput';

@Resolver(Project)
export class ProjectResolver {
	@FieldResolver(() => User)
	async creator(@Root() project: Project, @Ctx() { userLoader }: Context): Promise<User> {
		return userLoader.load(project.creatorId);
	}

	@Query(() => PaginatedProjects)
	async paginatedProjects(
		@Arg('limit', () => Int) limit: number,
		@Arg('offset', () => Int) offset: number
	): Promise<PaginatedProjects> {
		const projectService = new ProjectService();
		return await projectService.getPaginatedProject(offset, limit);
	}

	@Query(() => Project, { nullable: true })
	async project(@Arg('id', () => Int) id: number): Promise<ProjectResponse | undefined> {
		const projectService = new ProjectService();
		return await projectService.getProject(id);
	}

	@Mutation(() => JoinProjectResponse)
	@UseMiddleware(isAuth)
	async joinProject(
		@Ctx() context: Context,
		@Arg('projectId', () => Int) projectId: number
	): Promise<JoinProjectResponse> {
		const projectService = new ProjectService();
		return await projectService.joinProject(projectId, context);
	}

	@Mutation(() => ProjectResponse)
	@UseMiddleware(isAuth)
	async createProject(
		@Arg('attributes') attributes: CreateProjectInput,
		@Ctx() context: Context
	): Promise<ProjectResponse> {
		const projectService = new ProjectService();
		return await projectService.createProject(attributes, context);
	}

	//TODO: support updating skills and categories
	@Mutation(() => Project, { nullable: true })
	@UseMiddleware(isAuth)
	async updateProject(
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
	async deleteProject(@Arg('id', () => Int) id: number, @Ctx() { req }: Context): Promise<boolean> {
		//TODO: cascade delete
		await Project.delete({ id, creatorId: req.session.userId });
		return true;
	}
}
