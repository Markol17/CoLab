import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { Skill } from '../entities/Skill';
import { UserSkill } from '../entities/UserSkill';

const batchSkills = async (userIds: readonly number[]) => {
  const skillUsers = await UserSkill.find({
    join: {
      alias: 'userSkill',
      innerJoinAndSelect: {
        skill: 'userSkill.skill',
      },
    },
    where: {
      userId: In(userIds),
    },
  });

  const userIdToSkills: { [key: number]: Skill[] } = {};

  skillUsers.forEach((su) => {
    if (su.userId in userIdToSkills) {
      userIdToSkills[su.userId].push((su as any).__skill__);
    } else {
      userIdToSkills[su.userId] = [(su as any).__skill__];
    }
  });

  return userIds.map((userId) => userIdToSkills[userId]);
};

export const createUserSkillsLoader = () => new DataLoader(batchSkills);
