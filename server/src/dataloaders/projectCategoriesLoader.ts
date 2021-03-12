import DataLoader from "dataloader";
import { In } from "typeorm";
import { ProjectCategory } from "../entities/ProjectCategory";
import { Category } from "../entities/Category";

const batchCategories = async (projectIds: readonly number[]) => {
	const categoryProjects = await ProjectCategory.find({
		join: {
			alias: "projectCategory",
			innerJoinAndSelect: {
				category: "projectCategory.category",
			},
		},
		where: {
			//@ts-ignore
			projectId: In(projectIds),
		},
	});
	const projectIdToCategories: { [key: number]: Category[] } = {};

	categoryProjects.forEach((cp) => {
		if (cp.projectId in projectIdToCategories) {
			projectIdToCategories[cp.projectId].push((cp as any).__category__);
		} else {
			projectIdToCategories[cp.projectId] = [(cp as any).__category__];
		}
	});
	const mapping = projectIds.map((projectId) => projectIdToCategories[projectId]);
	return mapping;
};

export const createProjectCategoriesLoader = () => new DataLoader(batchCategories);
