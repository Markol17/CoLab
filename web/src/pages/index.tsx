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
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <Grid container justify='center' spacing={4}>
            {[0, 1, 2, 3].map((value) => (
              <Grid key={value} item>
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
                        Test
                      </Typography>
                      <Typography
                        variant='body2'
                        color='textSecondary'
                        component='p'
                      >
                        Test Project Test Project Test Project Test Project Test
                        Project Test Project
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

      {/* {!data && loading ? ( 
         <div>loading...</div>
       ) : (
            {data!.posts.posts.map((p) =>
            // !p ? null : (
              // <Flex key={p.id} p={5} shadow='md' borderWidth='1px'>
              //   {/* <UpdootSection post={p} /> 
              //   <Box flex={1}>
              //     <NextLink href='/post/[id]' as={`/post/${p.id}`}>
              //       <Link>
              //         <Heading fontSize='xl'>{p.title}</Heading>
              //       </Link>
              //     </NextLink>
              //     <Text>posted by {p.creator.username}</Text>
              //     <Flex align='center'>
              //       <Text flex={1} mt={4}>
              //         {p.textSnippet}
              //       </Text>
              //       <Box ml='auto'>
              //         <EditDeletePostButtons
              //           id={p.id}
              //           creatorId={p.creator.id}
              //         />
              //       </Box>
              //     </Flex>
              //   </Box>
              // </Flex>
            // )
          // )}
      // )}
      {/* {data && data.posts.hasMore ? ( 
        // <Flex>
        //   <Button
        //     onClick={() => {
        //       fetchMore({
        //         variables: {
        //           limit: variables?.limit,
        //           cursor:
        //             data.posts.posts[data.posts.posts.length - 1].createdAt,
        //         },
                // updateQuery: (
                //   previousValue,
                //   { fetchMoreResult }
                // ): PostsQuery => {
                //   if (!fetchMoreResult) {
                //     return previousValue as PostsQuery;
                //   }

                //   return {
                //     __typename: "Query",
                //     posts: {
                //       __typename: "PaginatedPosts",
                //       hasMore: (fetchMoreResult as PostsQuery).posts.hasMore,
                //       posts: [
                //         ...(previousValue as PostsQuery).posts.posts,
                //         ...(fetchMoreResult as PostsQuery).posts.posts,
                //       ],
                //     },
                //   };
                // },
        //       });
        //     }}
        //     isLoading={loading}
        //     m='auto'
        //     my={8}
        //   >
        //     load more
        //   </Button>
        //  </Flex>
        ) : null} */}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Index);
