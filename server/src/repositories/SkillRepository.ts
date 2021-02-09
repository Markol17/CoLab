import { EntityRepository, Repository } from 'typeorm';
import { Skill } from '../entities/Skill';

@EntityRepository(Skill)
export class SkillRepository extends Repository<Skill> {
	async getSkills(): Promise<Skill[]> {
		return await this.find();
	}
}
