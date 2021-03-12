import { GraphQLUpload } from "apollo-server-express";
import { Upload } from "src/types";
import { Field, InputType, Int } from "type-graphql";

@InputType()
export class CreateProjectInput {
	@Field()
	name: string;

	@Field()
	desc: string;

	@Field(() => [Int])
	skillIds: number[];

	@Field(() => [Int])
	categoryIds: number[];
	//@ts-ignore
	@Field(() => GraphQLUpload, { nullable: true })
	thumbnail: Upload;
}
