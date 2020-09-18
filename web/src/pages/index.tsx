//TODO: use lazy loading with React.lazy
import { useState } from 'react';
import { Layout } from '../components/Layout';
import { useProjectsQuery, ProjectsQuery } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';
import { makeStyles, Grid } from '@material-ui/core';
import { ProjectCard } from '../components/ProjectCard';

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
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });
  const classes = useStyles();

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
        <Grid container className={classes.root}>
          <Grid item xs={12}>
            <Grid container justify='center' spacing={4}>
              {data!.paginatedProjects.projects.map((project, index) => (
                <Grid key={index} item>
                  <ProjectCard project={project} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Index);
