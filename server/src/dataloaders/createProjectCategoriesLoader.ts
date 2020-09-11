import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { ProjectCategory } from 'src/entities/ProjectCategory';
import { Category } from 'src/entities/Category';

const batchCategories = async (projectIds: number[]) => {
  const categoriesProject = await ProjectCategory.find({
    join: {
      alias: 'projectCategory',
      innerJoinAndSelect: {
        category: 'projectCategory.category',
      },
    },
    where: {
      projectIds: In(projectIds),
    },
  });

  const projectIdToCategories: { [key: number]: Category[] } = {};

  /* example:
  {
    authorId: 1,
    bookId: 1,
    __author__: { id: 1, name: 'author1' }
  }
  */
  categoriesProject.forEach((cp) => {
    if (cp.categoryId in projectIdToCategories) {
      projectIdToCategories[cp.categoryId].push((cp as any).__category__);
    } else {
      projectIdToCategories[cp.categoryId] = [(cp as any).__category__];
    }
  });

  return projectIds.map((projectId) => projectIdToCategories[projectId]);
};

export const createProjectCategoriesLoader = () =>
  new DataLoader(batchCategories);
