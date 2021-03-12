import { getCustomRepository } from "typeorm";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { CategoriesResponse } from "../resolvers/ResponseTypes/CategoryResponse";

export class CategoryService {
	categoryRepository: CategoryRepository;

	constructor() {
		this.categoryRepository = getCustomRepository(CategoryRepository);
	}

	async getCategories(): Promise<CategoriesResponse> {
		const categories = await this.categoryRepository.getCategories();

		return { categories };
	}
}
