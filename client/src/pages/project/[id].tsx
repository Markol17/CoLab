import React from "react";
import { Layout } from "../../components/Layout";
import { Avatar, Box, Chip, createStyles, makeStyles, Paper, Theme, Typography } from "@material-ui/core";
import { useGetProjectFromUrl } from "../../utils/useGetProjectFromUrl";
import Image from "material-ui-image";
import { withApollo } from "../../utils/withApollo";
import { AvatarGroup } from "@material-ui/lab";
import { months } from "../../components/modals/LearnMoreModal";
import { Category, Skill } from "../../generated/graphql";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		sectionContainer: {
			boxShadow: "3px 3px 4px 0px rgb(0 0 0 / 20%)",
			padding: theme.spacing(3),
		},
		container: {
			display: "flex",
			flexWrap: "wrap",
		},
		subContainer: {
			display: "flex",
			flexWrap: "wrap",
			justifyContent: "space-between",
		},
		subDiv: {
			width: "500px",
			"&:nth-child(1)": {
				marginRight: theme.spacing(3),
			},
		},
		imgContainer: {
			maxWidth: "500px",
			minWidth: "500px",
			marginRight: theme.spacing(3),
			marginBottom: theme.spacing(3),
		},
		title: {
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
	})
);

const Project = ({}) => {
	const classes = useStyles();
	const { data, error, loading } = useGetProjectFromUrl();
	if (loading) {
		return (
			<Layout>
				<div>loading...</div>
			</Layout>
		);
	}

	if (error) {
		return <div>{error.message}</div>;
	}

	if (!data?.project) {
		return (
			<Layout>
				<Box>Could not find project</Box>
			</Layout>
		);
	}

	return (
		<Layout>
			<Paper className={classes.sectionContainer}>
				<div className={classes.container}>
					<div className={classes.imgContainer}>
						<Image
							src={
								data.project.thumbnail
									? `http://localhost:4000/projects/thumbnails/${data.project.thumbnail}`
									: `http://localhost:4000/projects/thumbnails/placeholder.jpg`
							}
							disableTransition
							aspectRatio={1.62}
							imageStyle={{ borderRadius: "3px" }}
							color='tranparent'
						/>
					</div>
					<div className={classes.subContainer}>
						<div className={classes.subDiv}>
							<Typography className={classes.title} variant='h3'>
								{data.project.name}
							</Typography>
							<Typography gutterBottom variant='subtitle1' color='textSecondary'>
								{data.project.desc}
							</Typography>
							<Typography variant='h6' className={classes.title}>
								Creator:
							</Typography>
							<Typography gutterBottom variant='subtitle1' color='textSecondary'>
								{data.project.creator.username}
							</Typography>
							<Typography variant='h6' className={classes.title}>
								Members:
							</Typography>
							<AvatarGroup max={5} style={{ marginBottom: "5.6px" }}>
								{data.project.members.map((member: any, index: number) => (
									<Avatar
										key={index}
										alt={member.username}
										// src='http://localhost:4000/projects/thumbnails/placeholder.jpg'
									/>
								))}
							</AvatarGroup>
							<Typography variant='h6' className={classes.title}>
								Created on:
							</Typography>
							<Typography gutterBottom variant='subtitle1' color='textSecondary'>
								{months[new Date(data.project.createdAt).getMonth()] +
									" " +
									new Date(data.project.createdAt).getDate() +
									", " +
									new Date(data.project.createdAt).getFullYear()}
							</Typography>
							<Typography variant='h6' className={classes.title}>
								Last active:
							</Typography>
							<Typography gutterBottom variant='subtitle1' color='textSecondary'>
								{months[new Date(data.project.createdAt).getMonth()] +
									" " +
									new Date(data.project.updatedAt).getDate() +
									", " +
									new Date(data.project.updatedAt).getFullYear()}
							</Typography>
						</div>
						<div className={classes.subDiv}>
							<Typography variant='h6' className={classes.title}>
								Category(ies):
							</Typography>
							<div className={classes.chips}>
								{data.project.categories.map((category: Category, index: number) => (
									<Chip
										style={{ backgroundColor: category.color, fontWeight: "bold" }}
										key={index}
										size='small'
										label={category.name}
									/>
								))}
							</div>
							<Typography variant='h6' className={classes.title}>
								Skill(s) required:
							</Typography>
							<div className={classes.chips}>
								{data.project.skills.map((skill: Skill, index: number) => (
									<Chip
										style={{ backgroundColor: skill.color, fontWeight: "bold" }}
										key={index}
										size='small'
										label={skill.type}
									/>
								))}
							</div>
							<Typography variant='h6' className={classes.title}>
								Collaborators limit:
							</Typography>
							<Typography gutterBottom variant='subtitle1' color='textSecondary'>
								{data.project.limit}
							</Typography>
						</div>
					</div>
				</div>
			</Paper>
		</Layout>
	);
};

export default withApollo({ ssr: true })(Project);
