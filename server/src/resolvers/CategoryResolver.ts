import { CategoryService } from "../services/CategoryService";
import { Resolver, Query } from "type-graphql";
import { Category } from "../entities/Category";
import { CategoriesResponse } from "./ResponseTypes/CategoryResponse";

@Resolver(Category)
export class CategoryResolver {
	@Query(() => CategoriesResponse, { nullable: true })
	async categories(): Promise<CategoriesResponse> {
		const categoryService = new CategoryService();
		return await categoryService.getCategories();
	}
}
