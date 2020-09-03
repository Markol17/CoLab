import React from 'react';
import { useState } from 'react';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Drawer from '@material-ui/core/Drawer';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';

import AssignmentIcon from '@material-ui/icons/Assignment';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ChatIcon from '@material-ui/icons/Chat';
import GroupIcon from '@material-ui/icons/Group';
import InfoIcon from '@material-ui/icons/Info';
import HomeIcon from '@material-ui/icons/Home';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import SettingsIcon from '@material-ui/icons/Settings';
import ExploreIcon from '@material-ui/icons/Explore';
import AddIcon from '@material-ui/icons/Add';
import HelpIcon from '@material-ui/icons/Help';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const drawerWidth = 240;

interface IndexDrawerProps {
  handleDrawerClose: () => void;
  isOpen: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(6) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(7) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  })
);

const IndexDrawer: React.FC<IndexDrawerProps> = ({
  handleDrawerClose,
  isOpen,
}) => {
  const theme = useTheme();
  const classes = useStyles();
  const [openProjects, setOpenProjects] = useState(true);
  const [openBookmarks, setOpenBookmarks] = useState(false);

  const handleProjectsClick = () => {
    setOpenProjects(!openProjects);
  };

  const handleBookmarksClick = () => {
    setOpenBookmarks(!openBookmarks);
  };

  return (
    <Drawer
      variant='permanent'
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: isOpen,
        [classes.drawerClose]: !isOpen,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: isOpen,
          [classes.drawerClose]: !isOpen,
        }),
      }}
    >
      <div className={classes.toolbar}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </div>
      <List>
        {['Home', 'Explore'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index === 0 ? (
                <HomeIcon />
              ) : index === 1 ? (
                <ExploreIcon />
              ) : null}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button key={'Projects'} onClick={handleProjectsClick}>
          <ListItemIcon>
            <AccountTreeIcon />
          </ListItemIcon>
          <ListItemText primary={'Projects'} />
          {openProjects ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openProjects} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary='Project 1' />
            </ListItem>
          </List>
        </Collapse>
        {/* bookmarks */}
        <ListItem button key={'Bookmarks'} onClick={handleBookmarksClick}>
          <ListItemIcon>
            <BookmarksIcon />
          </ListItemIcon>
          <ListItemText primary={'Bookmarks'} />
          {openBookmarks ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openBookmarks} timeout='auto' unmountOnExit>
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
      <Divider />
      <List>
        {['Settings', 'Send Comments', 'Help'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index === 0 ? (
                <SettingsIcon />
              ) : index === 1 ? (
                <AnnouncementIcon />
              ) : (
                <HelpIcon />
              )}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
export default IndexDrawer;
