import { UserRepository } from '../repositories/UserRepository';
import { getCustomRepository } from 'typeorm';
import { Ctx } from 'type-graphql';
import { Context } from '../types';
import argon2 from 'argon2';
import { UserProjectsResponse, UserResponse, UserSkillsResponse } from '../resolvers/ResponseTypes/UserResponse';
import { RegisterInput } from '../resolvers/InputTypes/UserInput';
import { validateRegister } from 'src/utils/validateRegister';

export class UserService {
	userRepository: UserRepository;

	constructor() {
		this.userRepository = getCustomRepository(UserRepository);
	}

	async getProjects(userId: number, @Ctx() context: Context): Promise<UserProjectsResponse> {
		const projects: any = [];
		if (context.req.session.userId === userId) {
			const userProjects = await this.userRepository.getProjectsByUserId(userId);
			userProjects.forEach((us: any) => {
				projects.push((us as any).__project__);
			});
		}

		return projects;
	}

	async getSkills(userId: number, @Ctx() context: Context): Promise<UserSkillsResponse> {
		const skills: any = [];
		if (context.req.session.userId === userId) {
			const userSkills = await this.userRepository.getSkillsByUserId(userId);
			userSkills.forEach((us: any) => {
				skills.push((us as any).__project__);
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
						field: 'email',
						message: 'An account already exists with that email',
					},
				],
			};
		}

		//set a cookie on the user
		context.req.session.userId = user.id;

		return { user };
	}
}
