import { Skill } from "../../entities/Skill";
import { Field, ObjectType } from "type-graphql";
import { FieldError } from "./ErrorResponse";

@ObjectType()
export class SkillsResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => [Skill], { nullable: true })
	skills?: Skill[];
}
