import { Resolver, Mutation, Arg, Ctx, Query, FieldResolver, Root, UseMiddleware } from 'type-graphql';
import { Context } from '../types';
import { User } from '../entities/User';
import argon2 from 'argon2';
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from '../constants';
import { sendEmail } from '../utils/sendEmail';
import { v4 } from 'uuid';
import { Project } from '../entities/Project';
import { UserProjectsResponse, UserResponse, UserSkillsResponse } from './ResponseTypes/UserResponse';
import { RegisterInput } from './InputTypes/UserInput';
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

	@Mutation(() => UserResponse)
	@UseMiddleware(isAuth)
	async changePassword(
		@Arg('token') token: string,
		@Arg('newPassword') newPassword: string,
		@Ctx() { redis, req }: Context
	): Promise<UserResponse> {
		if (newPassword.length <= 2) {
			return {
				errors: [
					{
						field: 'newPassword',
						message: 'length must be greater than 2',
					},
				],
			};
		}

		const key = FORGET_PASSWORD_PREFIX + token;
		const userId = await redis.get(key);
		if (!userId) {
			return {
				errors: [
					{
						field: 'token',
						message: 'token expired',
					},
				],
			};
		}

		const userIdNum = parseInt(userId);
		const user = await User.findOne(userIdNum);

		if (!user) {
			return {
				errors: [
					{
						field: 'token',
						message: 'user no longer exists',
					},
				],
			};
		}

		await User.update(
			{ id: userIdNum },
			{
				password: await argon2.hash(newPassword),
			}
		);

		await redis.del(key);

		// log in user after change password
		req.session.userId = user.id;

		return { user };
	}

	@Mutation(() => Boolean)
	async forgotPassword(@Arg('email') email: string, @Ctx() { redis }: Context) {
		const user = await User.findOne({ where: { email } });
		if (!user) {
			// the email is not in the db
			return true;
		}

		const token = v4();

		await redis.set(FORGET_PASSWORD_PREFIX + token, user.id, 'ex', 1000 * 60 * 60 * 24 * 3); // 3 days

		await sendEmail(email, `<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`);

		return true;
	}

	@Query(() => User, { nullable: true })
	currentUser(@Ctx() { req }: Context) {
		// you are not logged in
		if (!req.session.userId) {
			return null;
		}

		return User.findOne(req.session.userId);
	}

	@Mutation(() => UserResponse)
	async register(@Arg('options') attributes: RegisterInput, @Ctx() context: Context): Promise<UserResponse> {
		const userService = new UserService();
		return await userService.registerUser(attributes, context);
	}

	@Mutation(() => UserResponse)
	async login(
		@Arg('usernameOrEmail') usernameOrEmail: string,
		@Arg('password') password: string,
		@Ctx() { req }: Context
	): Promise<UserResponse> {
		let errorCount = 0;
		const user = await User.findOne(
			usernameOrEmail.includes('@') ? { where: { email: usernameOrEmail } } : { where: { username: usernameOrEmail } }
		);
		if (!user) {
			errorCount++;
		}
		if (!!user) {
			const valid = await argon2.verify(user.password, password);
			if (!valid) {
				errorCount++;
			}
		}

		if (errorCount !== 0) {
			return {
				errors: [
					{
						field: 'usernameOrEmail',
						message: 'Incorrect password and email/username combination',
					},
					{
						field: 'password',
						message: 'Incorrect password and email/username combination',
					},
				],
			};
		}
		req.session.userId = user!.id;

		return {
			user,
		};
	}

	@Mutation(() => Boolean)
	logout(@Ctx() { req, res }: Context) {
		return new Promise((resolve) =>
			req.session.destroy((err) => {
				res.clearCookie(COOKIE_NAME);
				if (err) {
					resolve(false);
					return;
				}

				resolve(true);
			})
		);
	}
}
