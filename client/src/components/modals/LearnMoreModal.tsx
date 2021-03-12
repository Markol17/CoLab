import React, { useContext } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Image from "material-ui-image";
import {
	Category,
	CurrentUserDocument,
	Project,
	Skill,
	useCurrentUserQuery,
	useJoinProjectMutation,
} from "../../generated/graphql";
import { ModalsContext, TOGGLE_LOGIN } from "../../utils/contexts/ModalsContext";
import { Chip, DialogContentText, IconButton, Typography, withStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { isServer } from "../../utils/isServer";

interface LearnMoreModalProps {
	userProjects: any;
	project: any;
	isOpen: boolean;
	onClose: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		modalContent: {
			padding: theme.spacing(0, 3, 2, 3),
		},
		modalActions: {
			padding: theme.spacing(1, 3, 2, 3),
		},
		thumbnail: {
			marginBottom: "20px",
		},
		reqJoin: {
			textTransform: "unset",
			color: theme.palette.common.white,
			minWidth: "90px",
			boxShadow: "3px 2px 9px 0px rgba(0,0,0,0.15)",
			fontWeight: "bold",
		},
		cancel: {
			marginRight: theme.spacing(1),
			borderColor: theme.palette.error.main,
			color: theme.palette.common.white,
			textTransform: "unset",
			minWidth: "90px",
			boxShadow: "3px 2px 9px 0px rgba(0,0,0,0.15)",
			fontWeight: "bold",
		},
		chips: {
			marginBottom: theme.spacing(3),
			display: "flex",
			flexWrap: "wrap",
			"& > *": {
				margin: 2,
			},
		},
		subtitles: {
			fontWeight: "bold",
		},
		subtitlesText: {
			marginBottom: theme.spacing(2),
			overflow: "hidden",
			textOverflow: "ellipsis",
			width: "100%",
		},
	})
);

const headerStyles = (theme: Theme) =>
	createStyles({
		root: {
			margin: 0,
			padding: theme.spacing(3),
		},
		closeButton: {
			position: "absolute",
			right: theme.spacing(2),
			top: theme.spacing(2),
		},
		title: {
			fontWeight: "bold",
		},
	});

const DialogTitle = withStyles(headerStyles)((props: any) => {
	const { children, classes, onClose } = props;
	return (
		<MuiDialogTitle disableTypography className={classes.root}>
			<Typography className={classes.title} variant='h5'>
				{children}
			</Typography>
			{onClose ? (
				<IconButton aria-label='close' className={classes.closeButton} onClick={onClose}>
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});

export const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export const LearnMoreModal: React.FC<LearnMoreModalProps> = ({ isOpen, onClose, project, userProjects }) => {
	const classes = useStyles();
	const { dispatch } = useContext(ModalsContext);
	const [joinProjectMutation] = useJoinProjectMutation();
	const { data } = useCurrentUserQuery({
		skip: isServer(),
	});
	const { id, name, desc, thumbnail, categories, skills, creator, members, createdAt, updatedAt } = project;
	const createdDate = new Date(createdAt);
	const updatedDate = new Date(updatedAt);

	const handleJoin = async () => {
		onClose();
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

	return (
		<Dialog open={isOpen} onClose={onClose} fullWidth maxWidth={"sm"}>
			<DialogTitle onClose={onClose}>{name}</DialogTitle>
			<DialogContent id='alert-dialog-description'>
				<div className={classes.thumbnail}>
					<Image
						src={
							thumbnail
								? `http://localhost:4000/projects/thumbnails/${thumbnail}`
								: `http://localhost:4000/projects/thumbnails/placeholder.jpg`
						}
						disableTransition
						aspectRatio={1.62}
						imageStyle={{ borderRadius: "3px" }}
						color='tranparent'
					/>
				</div>
				<Typography className={classes.subtitles} variant='subtitle1' gutterBottom>
					Description:
				</Typography>
				<div className={classes.subtitlesText}>
					<Typography paragraph variant='body1' color='textSecondary'>
						{desc}
					</Typography>
				</div>
				<Typography gutterBottom className={classes.subtitles} variant='subtitle1'>
					Categories:
				</Typography>
				<div className={classes.chips}>
					{categories.map((category: Category, index: number) => (
						<Chip
							style={{ backgroundColor: category.color, fontWeight: "bold" }}
							key={index}
							size='small'
							label={category.name}
						/>
					))}
				</div>
				<Typography gutterBottom variant='subtitle1' className={classes.subtitles}>
					Skills required to join:
				</Typography>
				<div className={classes.chips}>
					{skills.map((skill: Skill, index: number) => (
						<Chip
							style={{ backgroundColor: skill.color, fontWeight: "bold" }}
							key={index}
							size='small'
							label={skill.type}
						/>
					))}
				</div>
				<Typography className={classes.subtitles} gutterBottom variant='subtitle1'>
					Creator:
				</Typography>
				<DialogContentText>{creator.username}</DialogContentText>
				<Typography className={classes.subtitles} gutterBottom variant='subtitle1'>
					Collaborator(s):
				</Typography>
				<DialogContentText>{members.length}</DialogContentText>
				<Typography className={classes.subtitles} gutterBottom variant='subtitle1'>
					Created on:
				</Typography>
				<DialogContentText>
					{months[createdDate.getMonth()] + " " + createdDate.getDate() + ", " + createdDate.getFullYear()}
				</DialogContentText>
				<Typography className={classes.subtitles} gutterBottom variant='subtitle1'>
					Last active:
				</Typography>
				<DialogContentText>
					{months[updatedDate.getMonth()] + " " + updatedDate.getDate() + ", " + updatedDate.getFullYear()}
				</DialogContentText>
			</DialogContent>
			<DialogActions className={classes.modalActions}>
				<Button onClick={onClose} variant='outlined' className={classes.cancel}>
					Close
				</Button>
				{!userAlreadyJoined() && (
					<Button
						onClick={handleJoin}
						type='submit'
						disabled={false}
						className={classes.reqJoin}
						color='secondary'
						variant='outlined'>
						Request to join
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
};
