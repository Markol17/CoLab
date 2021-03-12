import React from 'react';
import { Layout } from '../../components/Layout';
import { Box } from '@material-ui/core';
import { withApollo } from '../../utils/withApollo';
import { useGetProfileFromUrl } from '../../utils/useGetProfileFromUrl';

const Profile = ({}) => {
	const { data, error, loading } = useGetProfileFromUrl();
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

	if (!data?.user) {
		return (
			<Layout>
				<Box>Could not find profile</Box>
			</Layout>
		);
	}

	return (
		<Layout>
			<Box mb={4}>{data.user.firstName + ' ' + data.user.lastName}</Box>
			<Box mb={4}>{data.user.username}</Box>
			<Box mb={4}>{data.user.school.name}</Box>
			<Box mb={4}>{data.user.program.name}</Box>
			<Box mb={4}>{data.user.yearOfStudy}</Box>
		</Layout>
	);
};

export default withApollo({ ssr: true })(Profile);
