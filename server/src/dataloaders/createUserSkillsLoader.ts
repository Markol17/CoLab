import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { Skill } from 'src/entities/Skill';
import { UserSkill } from 'src/entities/UserSkill';

const batchSkills = async (userIds: number[]) => {
  const skillsUser = await UserSkill.find({
    join: {
      alias: 'userSkill',
      innerJoinAndSelect: {
        skill: 'userSkill.skill',
      },
    },
    where: {
      userIds: In(userIds),
    },
  });

  const userIdToSkills: { [key: number]: Skill[] } = {};

  /* example:
  {
    authorId: 1,
    bookId: 1,
    __author__: { id: 1, name: 'author1' }
  }
  */
  skillsUser.forEach((su) => {
    if (su.skillId in userIdToSkills) {
      userIdToSkills[su.skillId].push((su as any).__skill__);
    } else {
      userIdToSkills[su.skillId] = [(su as any).__skill__];
    }
  });

  return userIds.map((userId) => userIdToSkills[userId]);
};

export const createUserSkillsLoader = () => new DataLoader(batchSkills);
