import { SchoolsResponse } from '../resolvers/ResponseTypes/SchoolResponse';
import { getCustomRepository } from 'typeorm';
import { SchoolRepository } from '../repositories/SchoolRepository';
import { ProgramsResponse } from '../resolvers/ResponseTypes/ProgramResponse';
import { ProgramRepository } from '../repositories/ProgramRepository';

export class SchoolService {
	schoolRepository: SchoolRepository;
	programRepository: ProgramRepository;

	constructor() {
		this.schoolRepository = getCustomRepository(SchoolRepository);
		this.programRepository = getCustomRepository(ProgramRepository);
	}

	async getSchoolPrograms(schoolId: number): Promise<ProgramsResponse> {
		const programs = await this.programRepository.getProgramsBySchoolId(schoolId);
		return { programs };
	}

	async getSchools(): Promise<SchoolsResponse> {
		const schools = await this.schoolRepository.getSchools();
		return { schools };
	}
}
