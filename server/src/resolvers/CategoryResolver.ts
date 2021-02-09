import { isAuth } from '../middleware/isAuth';
import { CategoryService } from '../services/CategoryService';
import { Resolver, Query, UseMiddleware } from 'type-graphql';
import { Category } from '../entities/Category';
import { CategoriesResponse } from './ResponseTypes/CategoryResponse';

@Resolver(Category)
export class CategoryResolver {
	@Query(() => CategoriesResponse, { nullable: true })
	@UseMiddleware(isAuth)
	async categories(): Promise<CategoriesResponse> {
		const categoryService = new CategoryService();
		return await categoryService.getCategories();
	}
}
