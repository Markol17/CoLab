import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { Project } from '../generated/graphql';

interface ProjectCardProps {
  project: Project;
}

const useStyles = makeStyles({
  card: {
    minWidth: 301,
    maxWidth: 300,
    boxShadow: '7px 7px 18px 0px rgba(0,0,0,0.2)',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: 2,
    },
  },
  cardContent: {
    padding: 10,
  },
});

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia
          component='img'
          alt='Thumbnail'
          height='180'
          image=''
          title='Test'
        />
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom variant='h5' component='h2'>
            {project.name}
          </Typography>
          <Typography variant='body2' color='textSecondary' component='p'>
            {project.desc}
          </Typography>
          <Typography variant='body2' color='textSecondary' component='p'>
            Categories:
          </Typography>
          <div className={classes.chips}>
            {project.categories.map((category, index) => (
              <Chip
                key={index}
                variant='outlined'
                size='small'
                label={category.name}
              />
            ))}
          </div>
          <Typography variant='body2' color='textSecondary' component='p'>
            Skills:
          </Typography>
          <div className={classes.chips}>
            {project.skills.map((skill, index) => (
              <Chip
                key={index}
                variant='outlined'
                size='small'
                label={skill.type}
              />
            ))}
          </div>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size='small' color='secondary'>
          Join
        </Button>
        <Button size='small' color='primary'>
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
};
