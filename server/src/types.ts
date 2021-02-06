import { Request, Response } from 'express';
import { Redis } from 'ioredis';
import { createUserLoader } from './dataloaders/userLoader';
import { createProjectSkillsLoader } from './dataloaders/projectSkillsLoader';
import { createProjectCategoriesLoader } from './dataloaders/projectCategoriesLoader';
import { Stream } from 'stream';

export type Context = {
	req: Request & { session: Express.Session };
	redis: Redis;
	res: Response;
	userLoader: ReturnType<typeof createUserLoader>;
	projectSkillsLoader: ReturnType<typeof createProjectSkillsLoader>;
	projectCategoriesLoader: ReturnType<typeof createProjectCategoriesLoader>;
};
export interface Upload {
	filename: string;
	mimetype: string;
	encoding: string;
	createReadStream: () => Stream;
}
