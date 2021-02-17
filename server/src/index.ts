import 'reflect-metadata';
import 'dotenv-safe/config';
import { __prod__, COOKIE_NAME } from './constants';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { ProjectResolver } from './resolvers/ProjectResolver';
import { UserResolver } from './resolvers/UserResolver';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { Project } from './entities/Project';
import { User } from './entities/User';
import path from 'path';
import { Skill } from './entities/Skill';
import { createUserLoader } from './dataloaders/userLoader';
import { createProjectSkillsLoader } from './dataloaders/projectSkillsLoader';
import { Category } from './entities/Category';
import { createProjectCategoriesLoader } from './dataloaders/projectCategoriesLoader';
import { ProjectCategory } from './entities/ProjectCategory';
import { ProjectSkill } from './entities/ProjectSkill';
import { UserSkill } from './entities/UserSkill';
import { UserProject } from './entities/UserProject';
import { createProjectMembersLoader } from './dataloaders/projectMembersLoader';
import { SkillResolver } from './resolvers/SkillResolver';
import { CategoryResolver } from './resolvers/categoryResolver';
import { Program } from './entities/Program';
import { School } from './entities/School';
import { SchoolResolver } from './resolvers/SchoolResolver';

const main = async () => {
	await createConnection({
		type: 'postgres',
		database: 'CoLab',
		username: 'postgres',
		password: 'Markol17',
		logging: true,
		synchronize: true,
		migrations: [path.join(__dirname, './migrations/*')],
		entities: [ProjectSkill, ProjectCategory, User, UserSkill, Skill, Project, Category, UserProject, Program, School],
	});
	// await conn.runMigrations();
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
				maxAge: 1000 * 60 * 60 * 24 * 365, // 1 years
				httpOnly: true,
				sameSite: 'lax', // csrf
				secure: __prod__, // cookies only work in https
			},
			saveUninitialized: false,
			secret: process.env.SESSION_SECRET,
			resave: false,
		})
	);
	app.use('/projects/thumbnails', express.static(path.join(__dirname, '../uploads/projects/thumbnails')));

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [ProjectResolver, UserResolver, SkillResolver, CategoryResolver, SchoolResolver],
			validate: false,
		}),
		context: ({ req, res }) => ({
			req,
			res,
			redis,
			userLoader: createUserLoader(),
			projectSkillsLoader: createProjectSkillsLoader(),
			projectCategoriesLoader: createProjectCategoriesLoader(),
			projectMembersLoader: createProjectMembersLoader(),
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
