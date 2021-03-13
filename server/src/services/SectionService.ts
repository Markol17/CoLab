import { CreateSectionInput } from "../resolvers/InputTypes/SectionInput";
import { getCustomRepository } from "typeorm";
import { SectionRepository } from "../repositories/SectionRepository";
import { SectionResponse } from "../resolvers/ResponseTypes/SectionResponse";

export class SectionService {
	sectionRepository: SectionRepository;

	constructor() {
		this.sectionRepository = getCustomRepository(SectionRepository);
	}

	async createSection(attributes: CreateSectionInput): Promise<SectionResponse> {
		const section = await this.sectionRepository.createAndSaveSection(attributes);
		return { section };
	}
}
