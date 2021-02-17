import { FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { School } from '../entities/School';
import { Program } from '../entities/Program';
import { SchoolService } from '../services/SchoolService';
import { SchoolsResponse } from './ResponseTypes/SchoolResponse';
import { ProgramsResponse } from './ResponseTypes/ProgramResponse';

@Resolver(School)
export class SchoolResolver {
	@FieldResolver(() => [Program])
	async programs(@Root() school: School): Promise<ProgramsResponse> {
		const schoolService = new SchoolService();
		return await schoolService.getSchoolPrograms(school.id);
	}

	@Query(() => SchoolsResponse)
	async schools(): Promise<SchoolsResponse> {
		const schoolService = new SchoolService();
		return await schoolService.getSchools();
	}
}
