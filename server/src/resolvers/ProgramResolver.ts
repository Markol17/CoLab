import { Program } from "../entities/Program";
import { ProgramService } from "../services/ProgramService";
import { Arg, Int, Query, Resolver } from "type-graphql";
import { SchoolProgramsResponse } from "./ResponseTypes/ProgramResponse";

@Resolver(Program)
export class ProgramResolver {
	@Query(() => SchoolProgramsResponse)
	async schoolPrograms(@Arg("schoolId", () => Int) schoolId: number): Promise<SchoolProgramsResponse> {
		const programService = new ProgramService();
		return await programService.getSchoolPrograms(schoolId);
	}
}
