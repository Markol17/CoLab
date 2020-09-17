import { ProjectInput } from '../resolvers/project';

export const validateCreateProject = (
  inputs: ProjectInput,
  skillsId: number[],
  categoryIds: number[]
) => {
  if (!inputs.name) {
    return [
      {
        field: 'name',
        message: 'Name can not be empty',
      },
    ];
  }
  if (!inputs.desc) {
    return [
      {
        field: 'desc',
        message: 'Description can not be empty',
      },
    ];
  }
  if (skillsId.length < 1) {
    return [
      {
        field: 'skillIds',
        message: 'At least one skill is required',
      },
    ];
  }
  if (categoryIds.length < 1) {
    return [
      {
        field: 'categoryIds',
        message: 'At least one category is required',
      },
    ];
  }

  return null;
};
