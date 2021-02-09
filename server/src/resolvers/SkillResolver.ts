import { isAuth } from '../middleware/isAuth';
import { SkillService } from '../services/SkillService';
import { Resolver, Query, UseMiddleware } from 'type-graphql';
import { Skill } from '../entities/Skill';
import { SkillsResponse } from './ResponseTypes/SkillResponse';

@Resolver(Skill)
export class SkillResolver {
	@Query(() => SkillsResponse, { nullable: true })
	@UseMiddleware(isAuth)
	async skills(): Promise<SkillsResponse> {
		const skillService = new SkillService();
		return await skillService.getSkills();
	}
}
