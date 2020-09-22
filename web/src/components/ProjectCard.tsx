import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { Category, Skill } from '../generated/graphql';

interface ProjectCardProps {
  name: string;
  desc: string;
  categories: Category[];
  skills: Skill[];
  img: string;
}

const useStyles = makeStyles({
  card: {
    minWidth: 310,
    maxWidth: 310,
    boxShadow: '7px 7px 18px 0px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
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

export const ProjectCard: React.FC<ProjectCardProps> = ({
  name,
  desc,
  categories,
  skills,
  img,
}) => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardActionArea>
        {!!img ? (
          <CardMedia
            component='img'
            alt='Thumbnail'
            height='180'
            src={process.env.PUBLIC_PROJECT_THUMBNAILS_URL + img}
          />
        ) : (
          <CardMedia
            component='img'
            alt='Thumbnail'
            height='200'
            src={`${process.env.PUBLIC_PROJECT_THUMBNAILS_URL}placeholder.jpg`}
          />
        )}
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom variant='h5' component='h2'>
            {name}
          </Typography>
          <Typography variant='body2' color='textSecondary' component='p'>
            {desc}
          </Typography>
          <Typography variant='body2' color='textSecondary' component='p'>
            Categories:
          </Typography>
          <div className={classes.chips}>
            {categories.map((category: Category, index: number) => (
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
            {skills.map((skill: Skill, index: number) => (
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
