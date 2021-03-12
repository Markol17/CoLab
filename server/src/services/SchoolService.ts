import { SchoolResponse, SchoolsResponse } from "../resolvers/ResponseTypes/SchoolResponse";
import { getCustomRepository } from "typeorm";
import { SchoolRepository } from "../repositories/SchoolRepository";
import { ProgramRepository } from "../repositories/ProgramRepository";

export class SchoolService {
	schoolRepository: SchoolRepository;
	programRepository: ProgramRepository;

	constructor() {
		this.schoolRepository = getCustomRepository(SchoolRepository);
		this.programRepository = getCustomRepository(ProgramRepository);
	}

	async getSchools(): Promise<SchoolsResponse> {
		const schools = await this.schoolRepository.getSchools();
		return { schools };
	}

	async getSchool(schoolId: number): Promise<SchoolResponse> {
		const school = await this.schoolRepository.getSchoolById(schoolId);
		return { school };
	}
}
