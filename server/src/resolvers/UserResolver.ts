import { Resolver, Mutation, Arg, Ctx, Query, FieldResolver, Root, UseMiddleware } from 'type-graphql';
import { Context } from '../types';
import { User } from '../entities/User';
import { Project } from '../entities/Project';
import { UserProjectsResponse, UserResponse, UserSkillsResponse } from './ResponseTypes/UserResponse';
import { ChangePasswordInput, LoginInput, RegisterInput } from './InputTypes/UserInput';
import { UserService } from '../services/UserService';
import { Skill } from '../entities/Skill';
import { isAuth } from '../middleware/isAuth';

@Resolver(User)
export class UserResolver {
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

	@Query(() => User, { nullable: true })
	async currentUser(@Ctx() context: Context) {
		const userService = new UserService();
		return await userService.getUser(context);
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
