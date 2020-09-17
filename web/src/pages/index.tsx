import NextLink from 'next/link';
import { useState } from 'react';
import { Layout } from '../components/Layout';
//import { UpdootSection } from '../components/UpdootSection';
import { useProjectsQuery, ProjectsQuery } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  makeStyles,
  Grid,
  Paper,
} from '@material-ui/core';

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
                  <Card className={classes.card}>
                    <CardActionArea>
                      <CardMedia
                        component='img'
                        alt='Test'
                        height='140'
                        image=''
                        title='Test'
                      />
                      <CardContent>
                        <Typography gutterBottom variant='h5' component='h2'>
                          {project.name}
                        </Typography>
                        <Typography
                          variant='body2'
                          color='textSecondary'
                          component='p'
                        >
                          {project.desc}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      <Button size='small' color='primary'>
                        Share
                      </Button>
                      <Button size='small' color='primary'>
                        Learn More
                      </Button>
                    </CardActions>
                  </Card>
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
