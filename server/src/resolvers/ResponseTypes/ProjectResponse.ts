import { Project } from '../../entities/Project';
import { Field, ObjectType } from 'type-graphql';
import { FieldError } from './ErrorResponse';

@ObjectType()
export class PaginatedProjects {
	@Field(() => [Project])
	projects: Project[];
	@Field()
	hasMore: boolean;
}

@ObjectType()
export class ProjectResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => Project, { nullable: true })
	project?: Project;
}
