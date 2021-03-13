import { CreateSectionInput } from "../resolvers/InputTypes/SectionInput";
import { EntityRepository, Repository } from "typeorm";
import { Section } from "../entities/Section";

@EntityRepository(Section)
export class SectionRepository extends Repository<Section> {
	async getSectonsByProjectId(projectId: number): Promise<Section[]> {
		return await this.find({ where: { projectId } });
	}

	async createAndSaveSection(attributes: CreateSectionInput): Promise<Section> {
		const { title } = attributes;
		const section = new Section();
		section.title = title;

		return await this.save(section);
	}
}
