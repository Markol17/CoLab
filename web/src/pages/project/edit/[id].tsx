import React from 'react';
import { Button, Box, Input } from '@material-ui/core';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { Layout } from '../../../components/Layout';
import {
  usePostQuery,
  useUpdatePostMutation,
} from '../../../generated/graphql';
import { useGetIntId } from '../../../utils/useGetIntId';
import { withApollo } from '../../../utils/withApollo';

const EditPost = ({}) => {
  const router = useRouter();
  const intId = useGetIntId();
  const { data, loading } = usePostQuery({
    skip: intId === -1,
    variables: {
      id: intId,
    },
  });
  const [updatePost] = useUpdatePostMutation();
  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }

  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          await updatePost({ variables: { id: intId, ...values } });
          router.back();
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
              update post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(EditPost);
