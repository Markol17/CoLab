import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import Drawer from "@material-ui/core/Drawer";
import NextLink from "next/link";
import clsx from "clsx";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Avatar, CircularProgress, Link, Typography } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";

import FileCopyIcon from "@material-ui/icons/FileCopy";
import HomeIcon from "@material-ui/icons/Home";
import HelpIcon from "@material-ui/icons/Help";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import SettingsIcon from "@material-ui/icons/Settings";
import ExploreIcon from "@material-ui/icons/Explore";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import BookmarksIcon from "@material-ui/icons/Bookmarks";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { useApolloClient } from "@apollo/client";

const drawerWidth = 240;

interface IndexDrawerProps {
	isDrawerOpen: boolean;
	isProjectOpen: boolean;
	isBookmarksOpen: boolean;
	isUserConnected: boolean;
	projects: any;
	handleProjectsClick: () => void;
	handleBookmarksClick: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		drawer: {
			width: drawerWidth,
			flexShrink: 0,
			whiteSpace: "nowrap",
		},
		drawerOpen: {
			width: drawerWidth,
			transition: theme.transitions.create("width", {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			}),
		},
		drawerClose: {
			transition: theme.transitions.create("width", {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			overflowX: "hidden",
			width: theme.spacing(6) + 1,
			[theme.breakpoints.up("sm")]: {
				width: theme.spacing(7),
			},
		},
		spacer: {
			...theme.mixins.toolbar,
		},
		nested: {
			paddingLeft: theme.spacing(4),
		},
		projectAvatar: {
			width: theme.spacing(4),
			height: theme.spacing(4),
		},
	})
);

const IndexDrawer: React.FC<IndexDrawerProps> = ({
	projects,
	isDrawerOpen,
	isProjectOpen,
	isUserConnected,
	isBookmarksOpen,
	handleProjectsClick,
	handleBookmarksClick,
}) => {
	const classes = useStyles();
	const apolloClient = useApolloClient();

	return (
		<Drawer
			variant='permanent'
			className={clsx(classes.drawer, {
				[classes.drawerOpen]: isDrawerOpen,
				[classes.drawerClose]: !isDrawerOpen,
			})}
			classes={{
				paper: clsx({
					[classes.drawerOpen]: isDrawerOpen,
					[classes.drawerClose]: !isDrawerOpen,
				}),
			}}>
			<div className={classes.spacer} />
			<List>
				{["Home", "Explore"].map((text, index) => (
					<>
						{index === 0 ? (
							<NextLink href='/'>
								<ListItem button key={index}>
									<ListItemIcon>
										<HomeIcon />
									</ListItemIcon>
									<ListItemText primary={text} />
								</ListItem>
							</NextLink>
						) : index === 1 ? (
							<ListItem button key={index}>
								<ListItemIcon>
									<ExploreIcon />
								</ListItemIcon>
								<ListItemText primary={text} />
							</ListItem>
						) : null}
					</>
				))}
			</List>
			{isUserConnected && (
				<>
					<Divider />
					<List>
						<ListItem button key={"Projects"} onClick={handleProjectsClick}>
							<ListItemIcon>
								<AccountTreeIcon />
							</ListItemIcon>
							<ListItemText primary={"Projects"} />
							{isProjectOpen ? <ExpandLess /> : <ExpandMore />}
						</ListItem>
						<Collapse in={isProjectOpen} timeout='auto' unmountOnExit>
							<List component='div' disablePadding>
								{projects ? (
									projects.map((project: { id: number; name: string; thumbnail: string }, index: number) => (
										<NextLink href='/project/[id]' as={`/project/${project.id}`}>
											<ListItem key={index} button className={classes.nested}>
												<ListItemIcon>
													<Avatar
														alt='Project Avatar'
														className={classes.projectAvatar}
														src={
															project.thumbnail
																? `http://localhost:4000/projects/thumbnails/${project.thumbnail}`
																: `http://localhost:4000/projects/thumbnails/placeholder.jpg`
														}
													/>
												</ListItemIcon>
												<Typography noWrap>{project.name}</Typography>
											</ListItem>
										</NextLink>
									))
								) : (
									<CircularProgress color='secondary' />
								)}
							</List>
						</Collapse>
						{/* bookmarks */}
						<ListItem button key={"Bookmarks"} onClick={handleBookmarksClick}>
							<ListItemIcon>
								<BookmarksIcon />
							</ListItemIcon>
							<ListItemText primary={"Bookmarks"} />
							{isBookmarksOpen ? <ExpandLess /> : <ExpandMore />}
						</ListItem>
						<Collapse in={isBookmarksOpen} timeout='auto' unmountOnExit>
							<List component='div' disablePadding>
								<ListItem button className={classes.nested}>
									<ListItemIcon>
										<FileCopyIcon />
									</ListItemIcon>
									<ListItemText primary='Bookmark 1' />
								</ListItem>
							</List>
						</Collapse>
					</List>
				</>
			)}
			<Divider />

			<List>
				{["Settings", "Send Comments", "Help"].map((text, index) => (
					<ListItem button key={text}>
						<ListItemIcon>
							{index === 0 ? <SettingsIcon /> : index === 1 ? <AnnouncementIcon /> : <HelpIcon />}
						</ListItemIcon>
						<ListItemText primary={text} />
					</ListItem>
				))}
			</List>
		</Drawer>
	);
};
export default IndexDrawer;
