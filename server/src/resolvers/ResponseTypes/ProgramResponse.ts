import { Field, ObjectType } from 'type-graphql';
import { FieldError } from './ErrorResponse';
import { Program } from '../../entities/Program';

@ObjectType()
export class ProgramsResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => [Program], { nullable: true })
	programs?: Program[];
}
