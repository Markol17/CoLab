import { RegisterInput } from '../resolvers/InputTypes/UserInput';
var validator = require('validator');

export const validateRegister = (attributes: RegisterInput) => {
	let errors = [];
	const { email, username, password, startDateOfStudy, expectedGraduationDate, firstName, lastName } = attributes;
	if (!email.includes('@')) {
		errors.push({
			field: 'email',
			message: 'Invalid email',
		});
	}

	if (!firstName) {
		errors.push({
			field: 'firstName',
			message: 'First name can not be empty',
		});
	}

	if (!lastName) {
		errors.push({
			field: 'lastName',
			message: 'Last name can not be empty',
		});
	}

	if (validator.isAfter(startDateOfStudy.toString(), expectedGraduationDate.toString())) {
		errors.push({
			field: 'startDateOfStudy',
			message: 'Start date of study cannot be after the expected graduation date',
		});
	}
	if (validator.isBefore(expectedGraduationDate.toString(), startDateOfStudy.toString())) {
		errors.push({
			field: 'expectedGraduationDate',
			message: 'Expected graduation date cannot be before the start date of study',
		});
	}

	if (username.length <= 2) {
		errors.push({
			field: 'username',
			message: 'Length must be greater than 2',
		});
	}

	if (username.includes('@')) {
		errors.push({
			field: 'username',
			message: 'Cannot include an @',
		});
	}

	if (password.length < 8) {
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
