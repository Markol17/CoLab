import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Chip,
	createStyles,
	makeStyles,
	Theme,
	Typography,
} from '@material-ui/core';
import React, { useContext } from 'react';
import {
	Category,
	CurrentUserDocument,
	Project,
	Skill,
	useCurrentUserQuery,
	useJoinProjectMutation,
} from '../generated/graphql';
import { ModalsContext, TOGGLE_LOGIN } from '../utils/contexts/ModalsContext';
import { isServer } from '../utils/isServer';

interface ProjectCardProps {
	userProjects: any;
	project: Project | undefined;
	setProject: any;
	toggleLearnMore: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		card: {
			minWidth: 310,
			maxWidth: 310,
			minHeight: '100%',
			maxHeight: '100%',
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
		subtitles: {
			fontWeight: 600,
		},
	})
);

export const ProjectCard: React.FC<ProjectCardProps> = ({ userProjects, project, setProject, toggleLearnMore }) => {
	const classes = useStyles();
	const { dispatch } = useContext(ModalsContext);
	const [joinProjectMutation] = useJoinProjectMutation();
	const { data } = useCurrentUserQuery({
		skip: isServer(),
	});
	const { id, name, desc, thumbnail, categories, skills } = project!;

	const userAlreadyJoined = () => {
		if (userProjects === null || userProjects === undefined) {
			return false;
		}
		let userAlreadyJoined = false;
		userProjects.forEach((userProject: Project) => {
			if (id === userProject.id) {
				userAlreadyJoined = true;
			}
		});

		return userAlreadyJoined;
	};

	const handleJoin = async () => {
		if (!data?.currentUser) {
			dispatch({ type: TOGGLE_LOGIN });
			return;
		}
		await joinProjectMutation({
			variables: { projectId: id },
			refetchQueries: [
				{
					query: CurrentUserDocument,
				},
			],
		});
	};

	const handleLearnMoreModal = () => {
		setProject(project);
		toggleLearnMore();
	};

	return (
		<Card className={classes.card}>
			<div className={classes.cardActionMedia} onClick={handleLearnMoreModal}>
				<CardMedia
					className={classes.img}
					component='img'
					alt='Thumbnail'
					src={
						!!thumbnail
							? `http://localhost:4000/projects/thumbnails/${thumbnail}`
							: `http://localhost:4000/projects/thumbnails/placeholder.jpg`
					}
				/>
				<CardContent className={classes.cardContent}>
					<Typography className={classes.subtitles} noWrap variant='h5'>
						{name}
					</Typography>
					<Typography gutterBottom variant='body2' color='textSecondary' noWrap>
						{desc}
					</Typography>
					<Typography className={classes.subtitles} variant='subtitle2' color='textSecondary'>
						Categories:
					</Typography>
					<div className={classes.chips}>
						{categories.map((category: Category, index: number) => (
							<Chip
								style={{ backgroundColor: category.color, fontWeight: 'bold' }}
								key={index}
								size='small'
								label={category.name}
							/>
						))}
					</div>
					<Typography className={classes.subtitles} variant='subtitle2' color='textSecondary'>
						Skills:
					</Typography>
					<div className={classes.chips}>
						{skills.map((skill: Skill, index: number) => (
							<Chip
								style={{ backgroundColor: skill.color, fontWeight: 'bold' }}
								key={index}
								size='small'
								label={skill.type}
							/>
						))}
					</div>
				</CardContent>
			</div>
			<CardActions>
				{!userAlreadyJoined() && (
					<Button className={classes.join} variant='outlined' color='secondary' onClick={handleJoin}>
						Request to join
					</Button>
				)}
				<Button onClick={handleLearnMoreModal} className={classes.learnMore} variant='outlined'>
					Learn more
				</Button>
			</CardActions>
		</Card>
	);
};
