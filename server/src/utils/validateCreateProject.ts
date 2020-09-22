import { ProjectInput } from '../resolvers/project';

export const validateCreateProject = (
  inputs: ProjectInput,
  skillsId: number[],
  categoryIds: number[]
) => {
  let errors = [];
  if (!inputs.name) {
    errors.push({
      field: 'name',
      message: 'Name can not be empty',
    });
  }
  if (!inputs.desc) {
    errors.push({
      field: 'desc',
      message: 'Description can not be empty',
    });
  }
  if (skillsId.length < 1) {
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
