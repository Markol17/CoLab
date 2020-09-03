import React from 'react';
import { Button, Box, Input } from '@material-ui/core';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { Layout } from '../components/Layout';
import { useCreatePostMutation } from '../generated/graphql';
import { useIsAuth } from '../utils/useIsAuth';
import { withApollo } from '../utils/withApollo';

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [createPost] = useCreatePostMutation();
  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values) => {
          const { errors } = await createPost({
            variables: { input: values },
            update: (cache) => {
              cache.evict({ fieldName: 'posts:{}' });
            },
          });
          if (!errors) {
            router.push('/');
          }
        }}
      >
        {(props) => (
          <Form>
            <Input
              name='title'
              placeholder='title'
              value={props.values.title}
              onChange={props.handleChange}
            />
            <Box mt={4}>
              <Input
                name='text'
                placeholder='text...'
                value={props.values.text}
                onChange={props.handleChange}
              />
            </Box>
            <Button type='submit' disabled={props.isSubmitting}>
              create post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreatePost);
