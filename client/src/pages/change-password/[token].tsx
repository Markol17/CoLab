import React, { useState } from "react";
import { NextPage } from "next";
import { Wrapper } from "../../components/Wrapper";
import { Formik, Form } from "formik";
import { toErrorMap } from "../../utils/toErrorMap";
import { Button, Box, Input, Link } from "@material-ui/core";
import { useChangePasswordMutation, CurrentUserQuery, CurrentUserDocument } from "../../generated/graphql";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { withApollo } from "../../utils/withApollo";

const ChangePassword: NextPage = () => {
	const router = useRouter();
	const [changePassword] = useChangePasswordMutation();
	const [tokenError, setTokenError] = useState("");
	return (
		<Wrapper>
			<Formik
				initialValues={{ newPassword: "" }}
				onSubmit={async (values, { setErrors }) => {
					const response = await changePassword({
						variables: {
							attributes: {
								newPassword: values.newPassword,
								token: typeof router.query.token === "string" ? router.query.token : "",
							},
						},
						update: (cache, { data }) => {
							cache.writeQuery<CurrentUserQuery>({
								query: CurrentUserDocument,
								data: {
									__typename: "Query",
									currentUser: data?.changePassword.user,
								},
							});
						},
					});
					if (response.data?.changePassword.errors) {
						const errorMap = toErrorMap(response.data.changePassword.errors);
						if ("token" in errorMap) {
							setTokenError(errorMap.token);
						}
						setErrors(errorMap);
					} else if (response.data?.changePassword.user) {
						// worked
						router.push("/");
					}
				}}>
				{(props) => (
					<Form>
						<Input
							name='newPassword'
							placeholder='new password'
							type='password'
							value={props.values.newPassword}
							onChange={props.handleChange}
						/>
						{tokenError ? (
							<>
								<Box>{tokenError}</Box>
								<NextLink href='/forgot-password'>
									<Link>click here to get a new one</Link>
								</NextLink>
							</>
						) : null}
						<Button type='submit' disabled={props.isSubmitting}>
							change password
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withApollo({ ssr: false })(ChangePassword);
