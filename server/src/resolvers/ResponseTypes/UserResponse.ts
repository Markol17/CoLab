import { User } from "../../entities/User";
import { Field, ObjectType } from "type-graphql";
import { FieldError } from "./ErrorResponse";
import { Project } from "../../entities/Project";
import { Skill } from "../../entities/Skill";

@ObjectType()
export class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => User, { nullable: true })
	user?: User;
}

@ObjectType()
export class UserProjectsResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => [Project], { nullable: true })
	projects?: Project[];
}

@ObjectType()
export class UserSkillsResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => [Skill], { nullable: true })
	skills?: Skill[];
}
