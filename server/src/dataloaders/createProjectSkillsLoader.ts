import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { ProjectSkill } from '../entities/ProjectSkill';
import { Skill } from '../entities/Skill';

const batchSkills = async (projectIds: readonly number[]) => {
  const projectSkills = await ProjectSkill.find({
    join: {
      alias: 'projectSkill',
      innerJoinAndSelect: {
        skill: 'projectSkill.skill',
      },
    },
    where: {
      projectId: In(projectIds),
    },
  });

  const projectIdToSkills: { [key: number]: Skill[] } = {};

  /* example:
  {
    authorId: 1,
    bookId: 1,
    __author__: { id: 1, name: 'author1' }
  }
  */
  projectSkills.forEach((ps) => {
    if (ps.skillId in projectIdToSkills) {
      projectIdToSkills[ps.skillId].push((ps as any).__skill__);
    } else {
      projectIdToSkills[ps.skillId] = (ps as any).__skill__;
    }
  });

  return projectIds.map((projectId) => projectIdToSkills[projectId]);
};

export const createProjectSkillsLoader = () => new DataLoader(batchSkills);
