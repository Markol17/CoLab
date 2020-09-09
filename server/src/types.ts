import { Request, Response } from 'express';
import { Redis } from 'ioredis';
import { createUserLoader } from './dataloaders/createUserLoader';
// import { createUpdootLoader } from './dataloaders/createUpdootLoader';

export type Context = {
  req: Request & { session: Express.Session };
  redis: Redis;
  res: Response;
  userLoader: ReturnType<typeof createUserLoader>;
  // updootLoader: ReturnType<typeof createUpdootLoader>;
};
