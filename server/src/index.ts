import 'reflect-metadata';
import 'dotenv-safe/config';
import { __prod__, COOKIE_NAME } from './constants';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { ProjectResolver } from './resolvers/project';
import { UserResolver } from './resolvers/user';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import { createConnection } from 'typeorm'; //getConnection
import { Project } from './entities/Project';
import { User } from './entities/User';
import path from 'path';
import { Skill } from './entities/Skill';
import { createUserLoader } from './dataloaders/createUserLoader';
import { createProjectSkillsLoader } from './dataloaders/createProjectSkillsLoader';
import { Category } from './entities/Category';
import { createProjectCategoriesLoader } from './dataloaders/createProjectCategoriesLoader';
import { createUserSkillsLoader } from './dataloaders/createUserSkillsLoader';

const main = async () => {
  await createConnection({
    type: 'postgres',
    database: 'CoLab',
    username: 'postgres',
    password: 'Markol17',
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, './migrations/*')],
    entities: [Project, User, Skill, Category],
  });
  // example to generate migration: yarn typeorm migration:generate -n setup
  // await conn.runMigrations();

  // const skill = new Skill();
  // skill.type = 'SWE';
  // await conn.manager.save(skill);

  // const category = new Category();
  // category.name = 'Technologie';
  // await conn.manager.save(category);

  // const project = new Project();
  // project.name = 'CoLab';
  // project.desc = 'CoLab is a platform for students to create projects';
  // project.skills = [skill];
  // project.categories = [category];
  // project.creatorId = 1;
  // project.points = 100;
  // await conn.manager.save(project);
  // await getConnection()
  //   .createQueryBuilder()
  //   .insert()
  //   .into(Project)
  //   .values({
  //     name: 'Test',
  //     desc: 'Test Project',
  //     points: 1,
  //     creatorId: 1,
  //   })
  //   .execute();

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);
  app.set('trust proxy', 1);
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: 'lax', // csrf
        secure: __prod__, // cookies only work in https
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ProjectResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      projectSkillsLoader: createProjectSkillsLoader(),
      projectCategoriesLoader: createProjectCategoriesLoader(),
      userSkillsLoader: createUserSkillsLoader(),
    }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(parseInt(process.env.PORT), () => {
    console.log('server started on localhost:4000');
  });
};

main().catch((err) => {
  console.error(err);
});
