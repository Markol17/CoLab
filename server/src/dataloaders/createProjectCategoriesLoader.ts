//FIXME: fix typing in dataloaders

import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { ProjectCategory } from '../entities/ProjectCategory';
import { Category } from '../entities/Category';

const batchCategories = async (projectIds: readonly number[]) => {
  const categoryProjects = await ProjectCategory.find({
    join: {
      alias: 'projectCategory',
      innerJoinAndSelect: {
        category: 'projectCategory.category',
      },
    },
    where: {
      projectId: In(projectIds),
    },
  });

  const projectIdToCategories: { [key: number]: Category[] } = {};

  categoryProjects.forEach((cp) => {
    if (cp.categoryId in projectIdToCategories) {
      projectIdToCategories[cp.projectId].push((cp as any).__category__);
    } else {
      projectIdToCategories[cp.projectId] = [(cp as any).__category__];
    }
  });

  return projectIds.map((projectId) => projectIdToCategories[projectId]);
};

export const createProjectCategoriesLoader = () =>
  new DataLoader(batchCategories);
