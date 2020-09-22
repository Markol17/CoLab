import { UsernamePasswordInput } from '../resolvers/UsernamePasswordInput';

export const validateRegister = (options: UsernamePasswordInput) => {
  let errors = [];
  if (!options.email.includes('@')) {
    errors.push({
      field: 'email',
      message: 'Invalid email',
    });
  }

  if (options.username.length <= 2) {
    errors.push({
      field: 'username',
      message: 'Length must be greater than 2',
    });
  }

  if (options.username.includes('@')) {
    errors.push({
      field: 'username',
      message: 'Cannot include an @',
    });
  }

  if (options.password.length < 8) {
    errors.push({
      field: 'password',
      message: 'Length must be at least 8 characters',
    });
  }

  if (errors.length !== 0) {
    return errors;
  }
  return null;
};
