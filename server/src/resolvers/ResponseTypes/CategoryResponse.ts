import { Category } from '../../entities/Category';
import { Field, ObjectType } from 'type-graphql';
import { FieldError } from './ErrorResponse';

@ObjectType()
export class CategoriesResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => [Category], { nullable: true })
	categories?: Category[];
}
