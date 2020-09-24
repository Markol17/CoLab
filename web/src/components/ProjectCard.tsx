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
import { Category, Skill, useJoinProjectMutation } from '../generated/graphql';

interface ProjectCardProps {
  id: number;
  name: string;
  desc: string;
  categories: Category[];
  skills: Skill[];
  img: string | null | undefined;
}

const useStyles = makeStyles({
  card: {
    minWidth: 310,
    maxWidth: 310,
    boxShadow: '7px 7px 18px 0px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.03)',
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
  img: {
    minHeight: 200,
    maxHeight: 200,
  },
  join: {
    textTransform: 'unset',
    minWidth: '100%',
    borderWidth: '2px',
    fontWeight: 'bold',
    '&:hover': {
      borderWidth: '2px',
    },
  },
});

export const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  desc,
  categories,
  skills,
  img,
}) => {
  const classes = useStyles();
  const [joinProject] = useJoinProjectMutation();

  const handleJoin = async () => {
    const response = await joinProject({
      variables: { projectId: id },
    });
  };

  return (
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia
          className={classes.img}
          component='img'
          alt='Thumbnail'
          src={
            !!img
              ? process.env.PUBLIC_PROJECT_THUMBNAILS_URL + img
              : `${process.env.PUBLIC_PROJECT_THUMBNAILS_URL}placeholder.jpg`
          }
        />

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
        <Button
          className={classes.join}
          variant='outlined'
          color='secondary'
          onClick={handleJoin}
        >
          Join
        </Button>
      </CardActions>
    </Card>
  );
};
