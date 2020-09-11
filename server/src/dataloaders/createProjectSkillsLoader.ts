import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { ProjectSkill } from 'src/entities/ProjectSkill';
import { Skill } from 'src/entities/Skill';

const batchSkills = async (projectIds: number[]) => {
  const skillsProject = await ProjectSkill.find({
    join: {
      alias: 'projectSkill',
      innerJoinAndSelect: {
        skill: 'projectSkill.skill',
      },
    },
    where: {
      projectIds: In(projectIds),
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
  skillsProject.forEach((sp) => {
    if (sp.skillId in projectIdToSkills) {
      projectIdToSkills[sp.skillId].push((sp as any).__skill__);
    } else {
      projectIdToSkills[sp.skillId] = [(sp as any).__skill__];
    }
  });

  return projectIds.map((projectId) => projectIdToSkills[projectId]);
};

export const createProjectSkillsLoader = () => new DataLoader(batchSkills);
