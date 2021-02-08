import { ProjectRepository } from '../repositories/ProjectRepository';
import { getCustomRepository } from 'typeorm';
import { JoinProjectResponse, PaginatedProjects, ProjectResponse } from 'src/resolvers/ResponseTypes/ProjectResponse';
import { Context } from '../types';
import { CreateProjectInput } from '../resolvers/InputTypes/ProjectInput';
import { validateCreateProject } from '../utils/validateCreateProject';
import { createWriteStream } from 'fs';
import path from 'path';
import { UserRepository } from '../repositories/UserRepository';

export class ProjectService {
	projectRepository: ProjectRepository;
	userRepository: UserRepository;

	constructor() {
		this.projectRepository = getCustomRepository(ProjectRepository);
		this.userRepository = getCustomRepository(UserRepository);
	}

	async getProject(projectId: number): Promise<ProjectResponse> {
		const project = await this.projectRepository.getProjectById(projectId);
		if (!project) {
			return {
				errors: [
					{
						field: 'project',
						message: 'Project does not exists',
					},
				],
			};
		}

		return { project };
	}

	async getPaginatedProject(offset: number, limit: number): Promise<PaginatedProjects> {
		const realLimit = Math.min(15, limit);
		const projects = await this.projectRepository.getPaginated({ offset, limit });

		return {
			projects: projects.slice(0, realLimit),
			hasMore: projects.length === realLimit + 1,
		};
	}

	async createProject(attributes: CreateProjectInput, context: Context): Promise<ProjectResponse> {
		const { thumbnail, skillIds, categoryIds } = attributes;
		const errors = validateCreateProject(attributes);
		if (errors) {
			return { errors };
		}

		const project = await this.projectRepository.createAndSaveProject(attributes, context);

		if (project) {
			let sIds: { projectId: number; skillId: number }[] = [];
			skillIds.forEach((_id, index) => {
				sIds.push({ projectId: project.id, skillId: skillIds[index] });
			});

			let cIds: { projectId: number; categoryId: number }[] = [];
			categoryIds.forEach((_id, index) => {
				cIds.push({ projectId: project.id, categoryId: categoryIds[index] });
			});

			await this.projectRepository.saveProjectSkillIds(sIds);
			await this.projectRepository.saveProjectCategoryIds(cIds);

			if (!!thumbnail) {
				const { createReadStream, filename } = await thumbnail;
				await new Promise((res) =>
					createReadStream()
						.pipe(createWriteStream(path.join(__dirname, '../../uploads/projects/thumbnails', filename)))
						.on('close', () => res)
				);
			}
		}

		return { project };
	}

	async joinProject(projectId: number, context: Context): Promise<JoinProjectResponse> {
		const { req } = context;

		const project = await this.projectRepository.getProjectById(projectId);
		if (!project) {
			return {
				errors: [
					{
						field: 'project',
						message: 'This project does not exist',
					},
				],
			};
		}
		const projectMembers = await this.projectRepository.getProjectMemberIdsById(projectId);
		const isFull = project?.limit === projectMembers.length;
		if (isFull) {
			return {
				errors: [
					{
						field: 'project',
						message: 'This project is full',
					},
				],
			};
		}

		let userAlreadyJoined = false;
		/*
		{
			userId: n,
			projectId: m
		}
		*/
		for (let member of projectMembers) {
			if (member.userId === req.session.userId) {
				userAlreadyJoined = true;
				break;
			}
		}

		if (userAlreadyJoined) {
			return {
				errors: [
					{
						field: 'project',
						message: 'You are already joined this project',
					},
				],
			};
		}
		const joined = await this.userRepository.saveUserProjectId(projectId, req.session.userId);
		if (joined) {
			return { joined };
		}

		return {
			errors: [
				{
					field: 'project',
					message: 'Could not join project',
				},
			],
		};
	}
}
