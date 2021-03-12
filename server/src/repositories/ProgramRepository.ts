import { Program } from "../entities/Program";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Program)
export class ProgramRepository extends Repository<Program> {
	async getProgramsBySchoolId(schoolId: number): Promise<Program[]> {
		return await this.find({ where: { schoolId } });
	}

	async getProgramById(programId: number): Promise<Program | undefined> {
		return await this.findOne({ where: { id: programId } });
	}
}
