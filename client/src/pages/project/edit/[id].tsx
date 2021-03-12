import React from 'react';
import { Button, Box, Input } from '@material-ui/core';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { Layout } from '../../../components/Layout';
import { useProjectQuery } from '../../../generated/graphql';
import { useGetIntId } from '../../../utils/useGetIntId';
import { withApollo } from '../../../utils/withApollo';

const EditProject = ({}) => {
  const router = useRouter();
  const intId = useGetIntId();
  const { data, loading } = useProjectQuery({
    skip: intId === -1,
    variables: {
      id: intId,
    },
  });
  // const [updateProject] = useUpdateProjectMutation();
  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (!data?.project) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Formik
        initialValues={{ name: data.project.name, desc: data.project.desc }}
        onSubmit={async (values) => {
          // await updateProject({ variables: { id: intId, ...values } });
          router.back();
        }}
      >
        {(props) => (
          <Form>
            <Input
              name='name'
              placeholder=''
              value={props.values.name}
              onChange={props.handleChange}
            />
            <Box mt={4}>
              <Input
                name='desc'
                placeholder='text...'
                value={props.values.desc}
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

export default withApollo({ ssr: false })(EditProject);
