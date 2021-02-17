import { EntityRepository, Repository } from 'typeorm';
import { School } from '../entities/School';

@EntityRepository(School)
export class SchoolRepository extends Repository<School> {
	async getSchools(): Promise<School[]> {
		return await this.find();
	}
}
