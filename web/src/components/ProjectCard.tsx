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
import { Category, Project, Skill, useJoinProjectMutation } from '../generated/graphql';

interface ProjectCardProps {
  userProjects: any,
  id: number;
  name: string;
  desc: string;
  categories: Category[];
  skills: Skill[];
  img: string | null | undefined;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
      paddingBottom: 0,
    },
    img: {
      minHeight: 200,
      maxHeight: 200,
    },
    cardActionMedia: {
      cursor: 'pointer',
    },
    learnMore: {
      minWidth: '47%',
      margin: 'auto',
      borderColor: theme.palette.common.white,
      color: theme.palette.common.white,
      textTransform: 'unset',
      fontWeight: 'bold',
      boxShadow: '3px 2px 9px 0px rgba(0,0,0,0.15)',
    },
    join: {
      minWidth: '47%',
      margin: 'auto',
      textTransform: 'unset',
      color: theme.palette.common.white,
      fontWeight: 'bold',
      boxShadow: '3px 2px 9px 0px rgba(0,0,0,0.15)',

    },
  })
);

export const ProjectCard: React.FC<ProjectCardProps> = ({
  userProjects,
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

  const userAlreadyJoined = () => {
    if(userProjects === null || userProjects === undefined){
      return false;
    }
    let userAlreadyJoined = false;
    userProjects.forEach((project: Project) => {
      if(id === project.id){
        userAlreadyJoined = true;
      }
    });
    
    return userAlreadyJoined;
  }

  return (
    <Card className={classes.card}>
      <div className={classes.cardActionMedia}>
        <CardMedia
          className={classes.img}
          component='img'
          alt='Thumbnail'
          src={
            !!img ? `http://localhost:4000/projects/thumbnails/${img}` : `http://localhost:4000/projects/thumbnails/placeholder.jpg`
          }
        />
        <CardContent className={classes.cardContent}>
          <Typography noWrap variant='h5' component='h2'>
            {name}
          </Typography>
          <Typography
            gutterBottom
            variant='body1'
            color='textSecondary'
            component='p'
          >
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
      </div>
      <CardActions>{!userAlreadyJoined() &&
        <Button
          className={classes.join}
          variant='outlined'
          color='secondary'
          onClick={handleJoin}
        >
          Request join
        </Button>
}
        <Button className={classes.learnMore} variant='outlined'>
          Learn more
        </Button>
      </CardActions>
    </Card>
  );
};
