import { CreateProjectInput } from 'src/resolvers/InputTypes/ProjectInput';

export const validateCreateProject = (inputs: CreateProjectInput) => {
	const { name, desc, skillIds, categoryIds } = inputs;
	let errors = [];
	if (!name) {
		errors.push({
			field: 'name',
			message: 'Name can not be empty',
		});
	}
	if (!desc) {
		errors.push({
			field: 'desc',
			message: 'Description can not be empty',
		});
	}
	if (skillIds.length < 1) {
		errors.push({
			field: 'skillIds',
			message: 'At least one skill is required',
		});
	}
	if (categoryIds.length < 1) {
		errors.push({
			field: 'categoryIds',
			message: 'At least one category is required',
		});
	}

	if (errors.length !== 0) {
		return errors;
	}

	return null;
};
