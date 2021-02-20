import { Resolver, Mutation, Arg, Ctx, Query, FieldResolver, Root, UseMiddleware, Int } from 'type-graphql';
import { Context } from '../types';
import { User } from '../entities/User';
import { Project } from '../entities/Project';
import { UserProjectsResponse, UserResponse, UserSkillsResponse } from './ResponseTypes/UserResponse';
import { ChangePasswordInput, LoginInput, RegisterInput } from './InputTypes/UserInput';
import { UserService } from '../services/UserService';
import { Skill } from '../entities/Skill';
import { isAuth } from '../middleware/isAuth';
import { School } from '../entities/School';
import { Program } from '../entities/Program';
import { ProgramService } from '../services/ProgramService';
import { SchoolService } from '../services/SchoolService';

@Resolver(User)
export class UserResolver {
	@FieldResolver(() => School)
	@UseMiddleware(isAuth)
	async school(@Root() user: User): Promise<School> {
		const schoolService = new SchoolService();
		return (await schoolService.getSchool(user.schoolId)).school!;
	}
	@FieldResolver(() => Program)
	@UseMiddleware(isAuth)
	async program(@Root() user: User): Promise<Program> {
		const programService = new ProgramService();
		return (await programService.getProgram(user.programId)).program!;
	}

	@FieldResolver(() => [Project])
	@UseMiddleware(isAuth)
	async projects(@Root() user: User, @Ctx() context: Context): Promise<UserProjectsResponse> {
		const userService = new UserService();
		return await userService.getProjects(user.id, context);
	}

	@FieldResolver(() => [Skill])
	@UseMiddleware(isAuth)
	async skills(@Root() user: User, @Ctx() context: Context): Promise<UserSkillsResponse> {
		const userService = new UserService();
		return await userService.getSkills(user.id, context);
	}

	@FieldResolver(() => Int)
	@UseMiddleware(isAuth)
	async yearOfStudy(@Root() user: User): Promise<number> {
		const userService = new UserService();
		return await userService.getYearOfStudy(user);
	}

	@Query(() => User, { nullable: true })
	async currentUser(@Ctx() context: Context): Promise<User | null> {
		const userService = new UserService();
		return await userService.getCurrentUser(context);
	}

	@Query(() => User)
	async user(@Arg('id', () => Int) id: number): Promise<User | null> {
		const userService = new UserService();
		return await userService.getUser(id);
	}

	@Mutation(() => UserResponse)
	@UseMiddleware(isAuth)
	async changePassword(
		@Arg('attributes') attributes: ChangePasswordInput,
		@Ctx() context: Context
	): Promise<UserResponse> {
		const userService = new UserService();
		return await userService.changePassword(attributes, context);
	}

	@Mutation(() => Boolean)
	async forgotPassword(@Arg('email') email: string, @Ctx() context: Context): Promise<boolean> {
		const userService = new UserService();
		return await userService.forgotPassword(email, context);
	}

	@Mutation(() => UserResponse)
	async register(@Arg('attributes') attributes: RegisterInput, @Ctx() context: Context): Promise<UserResponse> {
		const userService = new UserService();
		return await userService.registerUser(attributes, context);
	}

	@Mutation(() => UserResponse)
	async login(@Arg('attributes') attributes: LoginInput, @Ctx() context: Context): Promise<UserResponse> {
		const userService = new UserService();
		return await userService.loginUser(attributes, context);
	}

	@Mutation(() => Boolean)
	logout(@Ctx() context: Context) {
		const userService = new UserService();
		return userService.logoutUser(context);
	}
}
