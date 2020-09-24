import React from 'react';
import { Formik, Form } from 'formik';
import { Button, Box, Input } from '@material-ui/core';
import { Wrapper } from '../components/Wrapper';
import { useRegisterMutation, MeQuery, MeDocument } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withApollo } from '../utils/withApollo';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [register] = useRegisterMutation();
  return (
    <Wrapper>
      <Formik
        initialValues={{ email: '', username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({
            variables: { options: values },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: 'Query',
                  me: data?.register.user,
                },
              });
            },
          });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            // worked
            router.push('/');
          }
        }}
      >
        {(props) => (
          <Form>
            <Input
              name='username'
              placeholder='username'
              value={props.values.username}
              onChange={props.handleChange}
            />
            <Box mt={4}>
              <Input
                name='email'
                placeholder='email'
                value={props.values.email}
                onChange={props.handleChange}
              />
            </Box>
            <Box mt={4}>
              <Input
                name='password'
                placeholder='password'
                type='password'
                value={props.values.password}
                onChange={props.handleChange}
              />
            </Box>
            {props.errors.username ||
              props.errors.email ||
              (props.errors.password && (
                <div id='feedback'>
                  {props.errors.username &&
                    props.errors.email &&
                    props.errors.password}
                </div>
              ))}
            <Button type='submit' disabled={props.isSubmitting}>
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Register);
