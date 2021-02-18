import { SchoolProgramsResponse } from 'src/resolvers/ResponseTypes/ProgramResponse';
import { getCustomRepository } from 'typeorm';
import { ProgramRepository } from '../repositories/ProgramRepository';

export class ProgramService {
	programRepository: ProgramRepository;

	constructor() {
		this.programRepository = getCustomRepository(ProgramRepository);
	}

	async getSchoolPrograms(schoolId: number): Promise<SchoolProgramsResponse> {
		const programs = await this.programRepository.getProgramsBySchoolId(schoolId);

		return { programs };
	}
}
