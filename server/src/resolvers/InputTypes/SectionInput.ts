import { Field, InputType } from "type-graphql";

@InputType()
export class CreateSectionInput {
	@Field()
	title: string;
}
