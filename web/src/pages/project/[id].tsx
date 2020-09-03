import React from 'react';
import { Layout } from '../../components/Layout';
import { Box } from '@material-ui/core';
import { useGetProjectFromUrl } from '../../utils/useGetProjectFromUrl';
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons';
import { withApollo } from '../../utils/withApollo';

const Post = ({}) => {
  const { data, error, loading } = useGetProjectFromUrl();

  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box mb={4}>{data.post.title}</Box>
      <Box mb={4}>{data.post.text}</Box>
      <EditDeletePostButtons
        id={data.post.id}
        creatorId={data.post.creator.id}
      />
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);
