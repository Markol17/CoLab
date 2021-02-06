import { User } from '../entities/User';
import { EntityRepository, getConnection, Repository } from 'typeorm';
import { Project } from '../entities/Project';
import { UserProject } from '../entities/UserProject';
import { Skill } from '../entities/Skill';
import { UserSkill } from '../entities/UserSkill';
import { RegisterInput } from '../resolvers/InputTypes/UserInput';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
	async getProjectsByUserId(id: number): Promise<Project[]> {
		const projects = await UserProject.find({
			join: {
				alias: 'userProject',
				innerJoinAndSelect: {
					project: 'userProject.project',
				},
			},
			where: {
				userId: id,
			},
		});

		/*
		{
			userId: n,
			projectId: m,
			__project__: {id: m, name: x, ...}
		} 
		*/
		const userIdToProjects: Project[] = [];
		projects.forEach((project) => {
			userIdToProjects.push((project as any).__project__);
		});

		return userIdToProjects;
	}

	async getSkillsByUserId(id: number): Promise<Skill[]> {
		const skills = await UserSkill.find({
			join: {
				alias: 'userSkill',
				innerJoinAndSelect: {
					skill: 'userSkill.skill',
				},
			},
			where: {
				userId: id,
			},
		});

		/*
		{
			userId: n,
			skillId: m,
			__skill__: {id: m, type: x, ...}
		} 
		*/
		const userIdToSkills: Skill[] = [];
		skills.forEach((skill) => {
			userIdToSkills.push((skill as any).__skill__);
		});

		return userIdToSkills;
	}

	async createAndSaveUser(attributes: RegisterInput): Promise<User | void> {
		const { email, username, password } = attributes;
		const user = new User();
		user.email = email;
		user.username = username;
		user.password = password;
		try {
			return await this.save(user);
		} catch (err) {
			if (err.code === '23505') {
				return;
			}
		}
	}

	async getUserByUsernameOrEmail(usernameOrEmail: string): Promise<User | undefined> {
		return await this.findOne(
			usernameOrEmail.includes('@') ? { where: { email: usernameOrEmail } } : { where: { username: usernameOrEmail } }
		);
	}

	async getUserByEmail(email: string): Promise<User | undefined> {
		return await this.findOne({ where: { email } });
	}

	async getUserById(id: number): Promise<User | undefined> {
		return this.findOne(id);
	}

	async updateUserPassword(id: number, password: string): Promise<User> {
		const user = await getConnection()
			.createQueryBuilder()
			.update(User)
			.set({
				password,
			})
			.where('id = :id', { id })
			.returning('*')
			.execute()
			.then((response) => {
				return response.raw[0];
			});
		return user;
	}
}
