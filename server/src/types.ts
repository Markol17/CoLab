import { Request, Response } from 'express';
import { Redis } from 'ioredis';
import { createUserLoader } from './dataloaders/createUserLoader';
import { createProjectSkillsLoader } from './dataloaders/createProjectSkillsLoader';
import { createProjectCategoriesLoader } from './dataloaders/createProjectCategoriesLoader';
import { createUserSkillsLoader } from './dataloaders/createUserSkillsLoader';

export type Context = {
  req: Request & { session: Express.Session };
  redis: Redis;
  res: Response;
  userLoader: ReturnType<typeof createUserLoader>;
  projectSkillsLoader: ReturnType<typeof createProjectSkillsLoader>;
  projectCategoriesLoader: ReturnType<typeof createProjectCategoriesLoader>;
  userSkillsLoader: ReturnType<typeof createUserSkillsLoader>;
};
