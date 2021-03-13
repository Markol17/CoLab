import { Field, ObjectType } from "type-graphql";
import { FieldError } from "./ErrorResponse";
import { Section } from "../../entities/Section";

@ObjectType()
export class SectionResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => Section, { nullable: true })
	section?: Section;
}
