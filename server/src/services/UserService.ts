import { UserRepository } from "../repositories/UserRepository";
import { getCustomRepository } from "typeorm";
import { Ctx } from "type-graphql";
import { Context } from "../types";
import argon2 from "argon2";
import { UserProjectsResponse, UserResponse, UserSkillsResponse } from "../resolvers/ResponseTypes/UserResponse";
import { ChangePasswordInput, LoginInput, RegisterInput } from "../resolvers/InputTypes/UserInput";
import { validateRegister } from "../utils/validateRegister";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";
import { Project } from "../entities/Project";
import { Skill } from "../entities/Skill";
import { User } from "../entities/User";

export class UserService {
	userRepository: UserRepository;

	constructor() {
		this.userRepository = getCustomRepository(UserRepository);
	}

	async getCurrentUser(context: Context): Promise<User | null> {
		const { req } = context;
		if (!req.session.userId) {
			return null;
		}
		const user = await this.userRepository.getUserById(req.session.userId);
		if (!user) {
			return null;
		}
		return user;
	}

	async getUser(id: number): Promise<User | null> {
		const user = await this.userRepository.getUserById(id);
		if (!user) {
			return null;
		}
		return user;
	}

	async getYearOfStudy(user: User): Promise<number> {
		const start = new Date(user.startDateOfStudy);
		const expected = new Date(user.expectedGraduationDate);
		return expected.getFullYear() - start.getFullYear() - (expected.getFullYear() - new Date().getFullYear());
	}

	async getProjects(userId: number, @Ctx() context: Context): Promise<UserProjectsResponse> {
		const projects: any = [];
		if (context.req.session.userId === userId) {
			const userProjects = await this.userRepository.getProjectsByUserId(userId);
			userProjects.forEach((project: Project) => {
				projects.push(project);
			});
		}

		return projects;
	}

	async getSkills(userId: number, @Ctx() context: Context): Promise<UserSkillsResponse> {
		const skills: any = [];
		if (context.req.session.userId === userId) {
			const userSkills = await this.userRepository.getSkillsByUserId(userId);
			userSkills.forEach((skill: Skill) => {
				skills.push(skill);
			});
		}

		return skills;
	}

	async registerUser(attributes: RegisterInput, context: Context): Promise<UserResponse> {
		const { password } = attributes;
		const errors = validateRegister(attributes);
		if (errors) {
			return { errors };
		}

		attributes.password = await argon2.hash(password);
		const user = await this.userRepository.createAndSaveUser(attributes);
		if (!user) {
			return {
				errors: [
					{
						field: "email",
						message: "An account already exists with that email",
					},
				],
			};
		}

		//set a cookie on the user
		context.req.session.userId = user.id;

		return { user };
	}

	async loginUser(attributes: LoginInput, context: Context): Promise<UserResponse> {
		const { usernameOrEmail, password } = attributes;
		let errorCount = 0;
		const user = await this.userRepository.getUserByUsernameOrEmail(usernameOrEmail);
		if (!user) {
			errorCount++;
		}
		if (user) {
			const valid = await argon2.verify(user.password, password);
			if (!valid) {
				errorCount++;
			}
		}

		if (errorCount !== 0) {
			return {
				errors: [
					{
						field: "usernameOrEmail",
						message: "Incorrect password and email/username combination",
					},
					{
						field: "password",
						message: "Incorrect password and email/username combination",
					},
				],
			};
		}
		context.req.session.userId = user!.id;

		return {
			user,
		};
	}

	async logoutUser(context: Context): Promise<boolean> {
		const { req, res } = context;
		return await new Promise((resolve) =>
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

	async forgotPassword(email: string, context: Context): Promise<boolean> {
		const { redis } = context;
		const user = await this.userRepository.getUserByEmail(email);
		if (!user) {
			// the email is not in the db
			return true;
		}

		const token = v4();

		await redis.set(FORGET_PASSWORD_PREFIX + token, user.id, "ex", 1000 * 60 * 60 * 24 * 3); // 3 days

		await sendEmail(email, `<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`);

		return true;
	}

	async changePassword(attributes: ChangePasswordInput, context: Context): Promise<UserResponse> {
		const { token, newPassword } = attributes;
		const { redis, req } = context;
		if (newPassword.length <= 2) {
			return {
				errors: [
					{
						field: "newPassword",
						message: "length must be greater than 2",
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
						field: "token",
						message: "token expired",
					},
				],
			};
		}

		const userIdNum = parseInt(userId);
		const user = await this.userRepository.getUserById(userIdNum);

		if (!user) {
			return {
				errors: [
					{
						field: "token",
						message: "user no longer exists",
					},
				],
			};
		}
		const password = await argon2.hash(newPassword);
		await this.userRepository.updateUserPassword(userIdNum, password);

		await redis.del(key);

		// log in user after change password
		req.session.userId = user.id;

		return { user };
	}
}
