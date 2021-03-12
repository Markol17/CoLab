import React, { useState } from "react";
import { Wrapper } from "../components/Wrapper";
import { Formik, Form } from "formik";
import { Button, Box, Input } from "@material-ui/core";
import { useForgotPasswordMutation } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

const ForgotPassword: React.FC<{}> = ({}) => {
	const [complete, setComplete] = useState(false);
	const [forgotPassword] = useForgotPasswordMutation();
	return (
		<Wrapper>
			<Formik
				initialValues={{ email: "" }}
				onSubmit={async (values) => {
					await forgotPassword({ variables: values });
					setComplete(true);
				}}>
				{(props) =>
					complete ? (
						<Box>if an account with that email exists, we sent you can email</Box>
					) : (
						<Form>
							<Input
								name='email'
								placeholder='email'
								type='email'
								value={props.values.email}
								onChange={props.handleChange}
							/>
							<Button type='submit' disabled={props.isSubmitting}>
								forgot password
							</Button>
						</Form>
					)
				}
			</Formik>
		</Wrapper>
	);
};

export default withApollo({ ssr: false })(ForgotPassword);
