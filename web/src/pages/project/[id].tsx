import React from 'react';
import { Layout } from '../../components/Layout';
import { Box } from '@material-ui/core';
import { useGetProjectFromUrl } from '../../utils/useGetProjectFromUrl';
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons';
import { withApollo } from '../../utils/withApollo';

const Project = ({}) => {
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

	if (!data?.project) {
		return (
			<Layout>
				<Box>Could not find project</Box>
			</Layout>
		);
	}

	return (
		<Layout>
			<Box mb={4}>{data.project.name}</Box>
			<Box mb={4}>{data.project.desc}</Box>
			<Box mb={4}>{data.project.creator.username}</Box>
		</Layout>
	);
};

export default withApollo({ ssr: true })(Project);
