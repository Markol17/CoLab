import { EntityRepository, Repository } from "typeorm";
import { Category } from "../entities/Category";

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
	async getCategories(): Promise<Category[]> {
		return await this.find();
	}
}
