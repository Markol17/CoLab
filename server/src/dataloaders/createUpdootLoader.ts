import { Skill } from '../entities/Skill';
import DataLoader from 'dataloader';

// [{postId: 5, userId: 10}]
// [{postId: 5, userId: 10, value: 1}]
export const createUpdootLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Skill | null>(
    async (keys) => {
      const updoots = await Skill.findByIds(keys as any);
      const updootIdsToUpdoot: Record<string, Skill> = {};
      updoots.forEach((skill) => {
        updootIdsToUpdoot[`${skill.id}|${skill.project}`] = skill;
      });

      return keys.map(
        (key) => updootIdsToUpdoot[`${key.userId}|${key.postId}`]
      );
    }
  );
