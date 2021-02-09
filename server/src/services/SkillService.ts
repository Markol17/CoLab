import { getCustomRepository } from 'typeorm';
import { SkillsResponse } from '../resolvers/ResponseTypes/SkillResponse';
import { SkillRepository } from '../repositories/SkillRepository';

export class SkillService {
	skillRepository: SkillRepository;

	constructor() {
		this.skillRepository = getCustomRepository(SkillRepository);
	}

	async getSkills(): Promise<SkillsResponse> {
		const skills = await this.skillRepository.getSkills();

		return { skills };
	}
}
