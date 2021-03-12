//TODO: use lazy loading with React.lazy
import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { useCurrentUserQuery, usePaginatedProjectsQuery } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';
import { makeStyles, Grid, CircularProgress } from '@material-ui/core';
import { ProjectCard } from '../components/ProjectCard';
import React from 'react';
import { isServer } from '../utils/isServer';
import { LearnMoreModal } from '../components/modals/LearnMoreModal';

const useStyles = makeStyles({
	root: {
		flexGrow: 1,
	},
	card: {
		maxWidth: 345,
	},
	loadingContainer: {
		height: '10%',
	},
});

const Index = () => {
	const [currentProject, setProject] = useState({
		name: '',
		desc: '',
		categories: [],
		skills: [],
		members: [],
		creator: { username: '' },
	});
	const [isLearnMoreOpen, setLearnMoreModal] = useState(false);
	const [offset, setOffset] = useState(12);
	const classes = useStyles();
	const { data: userData } = useCurrentUserQuery({
		skip: isServer(),
	});
	const { data, error, loading, fetchMore, variables } = usePaginatedProjectsQuery({
		variables: {
			offset: 0,
			limit: 12,
		},
		notifyOnNetworkStatusChange: true, // rerender on refetch
	});

	useEffect(() => {
		window.addEventListener('scroll', loadMore);
		return () => window.removeEventListener('scroll', loadMore);
	}, [offset]);

	const handleLearnMoreModal = () => {
		setLearnMoreModal(!isLearnMoreOpen);
	};

	const loadMore = () => {
		const isBottom = window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight;
		if (isBottom && data?.paginatedProjects.hasMore && !loading) {
			fetchMore({
				variables: {
					limit: variables?.limit,
					offset: offset,
				},
			}).then((fetchMoreResult: any) => {
				setOffset(offset + fetchMoreResult.data.paginatedProjects.projects.length);
			});
		}
	};

	if (!loading && !data) {
		return (
			<div>
				<div>Error</div>
				<div>{error?.message}</div>
			</div>
		);
	}

	return (
		<Layout>
			{!data && loading ? (
				//TODO: add skeleton
				<>
					Loading...
					{/* <Grid justify='center' container>
						<CircularProgress color='secondary' />
					</Grid> */}
				</>
			) : (
				<>
					<Grid container className={classes.root}>
						<Grid item xs={12}>
							<Grid container justify='center' spacing={4}>
								{data!.paginatedProjects.projects.map((project: any, index: number) => (
									<Grid key={index} item>
										<ProjectCard
											userProjects={
												userData === undefined || userData === null ? undefined : userData.currentUser?.projects
											}
											project={project}
											setProject={setProject}
											toggleLearnMore={handleLearnMoreModal}
										/>
									</Grid>
								))}
							</Grid>
						</Grid>
					</Grid>
					<LearnMoreModal
						userProjects={userData === undefined || userData === null ? undefined : userData.currentUser?.projects}
						project={currentProject}
						onClose={handleLearnMoreModal}
						isOpen={isLearnMoreOpen}
					/>
				</>
			)}
			{loading && (
				<Grid justify='center' alignItems='center' className={classes.loadingContainer} container>
					<CircularProgress color='secondary' />
				</Grid>
			)}
		</Layout>
	);
};

export default withApollo({ ssr: true })(Index);
