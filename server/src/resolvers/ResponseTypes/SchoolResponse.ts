import { Field, ObjectType } from 'type-graphql';
import { FieldError } from './ErrorResponse';
import { School } from '../../entities/School';

@ObjectType()
export class SchoolsResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => [School], { nullable: true })
	schools?: School[];
}
