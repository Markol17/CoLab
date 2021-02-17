import { InputType, Field, Int } from 'type-graphql';
@InputType()
export class RegisterInput {
	@Field()
	email: string;
	@Field()
	username: string;
	@Field()
	firstName: string;
	@Field()
	lastName: string;
	@Field()
	password: string;
	@Field()
	startDateOfStudy: Date;
	@Field()
	expectedGraduationDate: Date;
	@Field(() => Int)
	schoolId: number;
	@Field(() => Int)
	programId: number;
}

@InputType()
export class LoginInput {
	@Field()
	usernameOrEmail: string;
	@Field()
	password: string;
}

@InputType()
export class ChangePasswordInput {
	@Field()
	token: string;
	@Field()
	newPassword: string;
}
