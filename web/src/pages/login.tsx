import React from 'react';
import { Formik, Form } from 'formik';
import { Button, Box, Input, Link } from '@material-ui/core';
import { Wrapper } from '../components/Wrapper';
import { useLoginMutation, MeQuery, MeDocument } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { withApollo } from '../utils/withApollo';

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [login] = useLoginMutation();
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            variables: values,
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: 'Query',
                  me: data?.login.user,
                },
              });
              cache.evict({ fieldName: 'posts:{}' });
            },
          });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            console.log(router.query);
            if (typeof router.query.next === 'string') {
              router.push(router.query.next);
            } else {
              // worked
              router.push('/');
            }
          }
        }}
      >
        {(props) => (
          <Form>
            <Input
              name='usernameOrEmail'
              placeholder='username or email'
              value={props.values.usernameOrEmail}
              onChange={props.handleChange}
            />
            <Box mt={4}>
              <Input
                name='password'
                placeholder='password'
                type='password'
                value={props.values.password}
                onChange={props.handleChange}
              />
            </Box>

            <NextLink href='/forgot-password'>
              <Link>forgot password?</Link>
            </NextLink>

            <Button type='submit' disabled={props.isSubmitting}>
              login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Login);
