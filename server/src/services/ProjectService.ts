import { ProjectRepository } from '../repositories/ProjectRepository';
import { getCustomRepository } from 'typeorm';
import { PaginatedProjects, ProjectResponse } from 'src/resolvers/ResponseTypes/ProjectResponse';
import { Context } from '../types';
import { CreateProjectInput } from '../resolvers/InputTypes/ProjectInput';
import { validateCreateProject } from '../utils/validateCreateProject';
import { createWriteStream } from 'fs';
import path from 'path';

export class ProjectService {
	projectRepository: ProjectRepository;

	constructor() {
		this.projectRepository = getCustomRepository(ProjectRepository);
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

	async createProject(inputs: CreateProjectInput, context: Context): Promise<ProjectResponse> {
		const { thumbnail, skillIds, categoryIds } = inputs;
		const errors = validateCreateProject(inputs);
		if (errors) {
			return { errors };
		}

		const project = await this.projectRepository.createAndSaveProject(inputs, context);

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
				await new Promise(async (resolve, reject) =>
					thumbnail
						.createReadStream()
						.pipe(createWriteStream(path.join(__dirname, '../../uploads/projects/thumbnails', thumbnail.filename)))
						.on('finish', () => resolve(true))
						.on('error', () => reject(false))
				);
			}
		}

		return { project };
	}
}
