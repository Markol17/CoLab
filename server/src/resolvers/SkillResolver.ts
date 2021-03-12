import { SkillService } from "../services/SkillService";
import { Resolver, Query } from "type-graphql";
import { Skill } from "../entities/Skill";
import { SkillsResponse } from "./ResponseTypes/SkillResponse";

@Resolver(Skill)
export class SkillResolver {
	@Query(() => SkillsResponse, { nullable: true })
	async skills(): Promise<SkillsResponse> {
		const skillService = new SkillService();
		return await skillService.getSkills();
	}
}
