import { Query, Resolver } from 'type-graphql';
import { School } from '../entities/School';
import { SchoolService } from '../services/SchoolService';
import { SchoolsResponse } from './ResponseTypes/SchoolResponse';

@Resolver(School)
export class SchoolResolver {
	@Query(() => SchoolsResponse)
	async schools(): Promise<SchoolsResponse> {
		const schoolService = new SchoolService();
		return await schoolService.getSchools();
	}
}
