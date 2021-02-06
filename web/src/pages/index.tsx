//TODO: use lazy loading with React.lazy
import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useProjectsQuery, ProjectsQuery, Project } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';
import { makeStyles, Grid, Box, List, CircularProgress } from '@material-ui/core';
import { ProjectCard } from '../components/ProjectCard';
import React from 'react';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  card: {
    maxWidth: 345,
  },
});

const Index = () => {
  const { data, error, loading, fetchMore, variables } = useProjectsQuery({
    variables: {
      limit: 15,
      offset: 0,
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
    if(isBottom){
      fetchMore({
        variables: {
          limit: variables?.limit,
          offset: (data!.paginatedProjects.projects.length % 14),
        },
          updateQuery: (previousValue, { fetchMoreResult }): ProjectsQuery => {
                  if (!fetchMoreResult) {
                    return previousValue as ProjectsQuery;
                  }

                  return {
                    __typename: "Query",
                    paginatedProjects: {
                      __typename: "PaginatedProjects",
                      hasMore: (fetchMoreResult as ProjectsQuery).paginatedProjects.hasMore,
                      projects: [
                        ...(previousValue as ProjectsQuery).paginatedProjects.projects,
                        ...(fetchMoreResult as ProjectsQuery).paginatedProjects.projects,
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
        <div>loading...</div>
      ) : (
        <>
        <Grid container className={classes.root}>
          <Grid item xs={12}>
            <Grid container justify='center' spacing={4} >
              {data!.paginatedProjects.projects.map(
                (project, index: number) => (
                  <Grid key={index} item>
                    <ProjectCard
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
          ( <Box m="auto"><CircularProgress color="secondary" /></Box>) 
        }
    </Layout>
  );
};

export default withApollo({ ssr: true })(Index);
