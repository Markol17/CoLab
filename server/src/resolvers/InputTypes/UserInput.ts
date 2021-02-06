import { InputType, Field } from 'type-graphql';
@InputType()
export class RegisterInput {
	@Field()
	email: string;
	@Field()
	username: string;
	@Field()
	password: string;
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
