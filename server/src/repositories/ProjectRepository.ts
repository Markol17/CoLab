import { CreateProjectInput } from "src/resolvers/InputTypes/ProjectInput";
import { Context } from "../types";
import { EntityRepository, getConnection, Repository } from "typeorm";
import { Project } from "../entities/Project";
import { ProjectSkill } from "../entities/ProjectSkill";
import { ProjectCategory } from "../entities/ProjectCategory";
import { UserProject } from "../entities/UserProject";

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {
	async getPaginated(paginationValues: { offset: number; limit: number }): Promise<Project[]> {
		const { offset, limit } = paginationValues;
		return await getConnection().query(
			`
                SELECT p.*
                FROM project p
                ORDER BY p."createdAt" DESC
                OFFSET ${offset} ROWS
                FETCH NEXT ${limit} ROWS ONLY
            `
		);
	}

	async getProjectById(id: number): Promise<Project | undefined> {
		return this.findOne(id);
	}

	async getProjectMemberIdsById(id: number): Promise<UserProject[]> {
		return await UserProject.find({ where: { projectId: id } });
	}

	async createAndSaveProject(attributes: CreateProjectInput, { req }: Context): Promise<Project> {
		const { name, desc, thumbnail } = attributes;
		let thumbnailName = undefined;
		if (!!thumbnail) {
			const { filename } = await thumbnail;
			thumbnailName = filename;
		}
		const project = new Project();
		project.name = name;
		project.desc = desc;
		project.thumbnail = thumbnailName;
		project.creatorId = req.session.userId;

		return await this.save(project);
	}

	async saveProjectSkillIds(skillIds: { projectId: number; skillId: number }[]) {
		await getConnection().createQueryBuilder().insert().into(ProjectSkill).values(skillIds).execute();
	}

	async saveProjectCategoryIds(categoryIds: { projectId: number; categoryId: number }[]) {
		await getConnection().createQueryBuilder().insert().into(ProjectCategory).values(categoryIds).execute();
	}
}
