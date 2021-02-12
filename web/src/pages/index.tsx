//TODO: use lazy loading with React.lazy
import { useEffect } from 'react';
import { Layout } from '../components/Layout';
import { PaginatedProjectsQuery, useCurrentUserQuery, usePaginatedProjectsQuery } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';
import { makeStyles, Grid, Box, CircularProgress } from '@material-ui/core';
import { ProjectCard } from '../components/ProjectCard';
import React from 'react';
import { isServer } from '../utils/isServer';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  card: {
    maxWidth: 345,
  },
  loadingContainer: {
    height: '10%',
  }
});

const Index = () => {
  const { data: userData, loading: userLoading } = useCurrentUserQuery({
    skip: isServer(),
  });
  const { data, error, loading, fetchMore, variables } = usePaginatedProjectsQuery({
       variables: {
          offset: 0,
          limit: 15,
       },
       notifyOnNetworkStatusChange: true,
     });

  const classes = useStyles();

  useEffect(() => {
    window.addEventListener('scroll', loadMore);
    return () => window.removeEventListener('scroll', loadMore);
  }, []);

  const loadMore = () => {
    const isBottom = window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight;
    if(isBottom && data?.paginatedProjects.hasMore){
      fetchMore({
        variables: {
          limit: variables?.limit,
          offset: (data!.paginatedProjects.projects.length % 14),
        },
          updateQuery: (previousValue, { fetchMoreResult }): PaginatedProjectsQuery => {
                  if (!fetchMoreResult) {
                    return previousValue as PaginatedProjectsQuery;
                  }

                  return {
                    __typename: "Query",
                    paginatedProjects: {
                      __typename: "PaginatedProjects",
                      hasMore: (fetchMoreResult as PaginatedProjectsQuery).paginatedProjects.hasMore,
                      projects: [
                        ...(previousValue as PaginatedProjectsQuery).paginatedProjects.projects,
                        ...(fetchMoreResult as PaginatedProjectsQuery).paginatedProjects.projects,
                      ],
                    },
                  };
                },
        })  
      }   
    }

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
          <Grid justify="center" container><CircularProgress color="secondary" /></Grid>
        </>
      ) : (
        <>
        <Grid container className={classes.root}>
          <Grid item xs={12}>
            <Grid container justify='center' spacing={4} >
              {data!.paginatedProjects.projects.map(
                (project, index: number) => (
                  <Grid key={index} item>
                    <ProjectCard
                      userProjects={userData === undefined || userData === null ? undefined : userData.currentUser?.projects}
                      id={project.id}
                      name={project.name}
                      desc={project.desc}
                      categories={project.categories}
                      skills={project.skills}
                      img={project.thumbnail}
                    />
                  </Grid>
                )
              )}
            </Grid>
          </Grid>
        </Grid>
        </>
      )}
           {loading &&
          ( <Grid justify="center" alignItems='center' className={classes.loadingContainer} container><CircularProgress color="secondary" /></Grid>) 
        }
    </Layout>
  );
};

export default withApollo({ ssr: true })(Index);
