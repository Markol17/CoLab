//pierre bélair
import React from 'react';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import IndexDrawer from './IndexDrawer';
import {
  Paper,
  MenuItem,
  Badge,
  Menu,
  InputBase,
  fade,
  Button,
} from '@material-ui/core';

import { useApolloClient } from '@apollo/client';
import NextLink from 'next/link';
import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import { isServer } from '../utils/isServer';

import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AddIcon from '@material-ui/icons/Add';

const drawerWidth = 240;

interface NavBarProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    grow: {
      flexGrow: 1,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      padding: theme.spacing(0.3),
    },
    menuButton: {
      marginRight: 10,
    },
    hide: {
      display: 'none',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    container: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: '25%',
        minWidth: '300px',
        justifyContent: 'center',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 1.5),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    login: {
      marginRight: theme.spacing(2),
      color: theme.palette.common.white,
      borderColor: theme.palette.common.white,
      textTransform: 'unset',
      minWidth: '90px',
    },
    register: {
      color: theme.palette.common.white,
      textTransform: 'unset',
      minWidth: '90px',
    },
  })
);

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [openProjects, setOpenProjects] = React.useState(true);
  const [openBookmarks, setOpenBookmarks] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [
    mobileMoreAnchorEl,
    setMobileMoreAnchorEl,
  ] = React.useState<null | HTMLElement>(null);
  const [
    unregisteredMobileMoreAnchorEl,
    setUnregisteredMobileMoreAnchorEl,
  ] = React.useState<null | HTMLElement>(null);

  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });
  const [logout, { loading: logoutFetching }] = useLogoutMutation();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isUnregisteredMobileMenuOpen = Boolean(unregisteredMobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
    setUnregisteredMobileMoreAnchorEl(null);
  };
  const handleUnregisteredMobileMenuClose = () => {
    setUnregisteredMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
    handleUnregisteredMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleUnregisteredMobileMenuOpen = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setUnregisteredMobileMoreAnchorEl(event.currentTarget);
  };

  const toggleDrawer = () => {
    setOpen(!open);
    if (open) {
      setOpenProjects(false);
      setOpenBookmarks(false);
    }
  };

  const handleProjectsClick = () => {
    setOpenProjects(!openProjects);
    setOpen(true);
  };

  const handleBookmarksClick = () => {
    setOpenBookmarks(!openBookmarks);
    setOpen(true);
  };

  const logoutUser = async () => {
    await logout();
    await apolloClient.resetStore();
    handleMenuClose();
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
      <MenuItem onClick={logoutUser} disabled={logoutFetching}>
        Logout
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label='show 4 new mails' color='inherit'>
          <Badge badgeContent={null} color='secondary'>
            <AddIcon />
          </Badge>
        </IconButton>
        <p>Create Project</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label='show 11 new notifications' color='inherit'>
          <Badge badgeContent={null} color='secondary'>
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label='account of current user'
          aria-controls='primary-search-account-menu'
          aria-haspopup='true'
          color='inherit'
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const mobileMenuIdUnregistered = 'primary-unregistered-menu-mobile';
  const renderMobileMenuUnregistered = (
    <Menu
      anchorEl={unregisteredMobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuIdUnregistered}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isUnregisteredMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <p>Login</p>
      </MenuItem>
      <MenuItem>
        <p>Register</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Paper elevation={3}>
        <AppBar position='fixed' className={classes.appBar}>
          <Toolbar>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={toggleDrawer}
              edge='start'
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <div className={classes.container}>
              <Typography variant='h6' noWrap>
                Colab
              </Typography>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder='Search a project…'
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ 'aria-label': 'search' }}
                />
              </div>
              {loading ? null /* data loading */ : !data?.me ? (
                /*user not logged in*/ <>
                  <div className={classes.sectionDesktop}>
                    <NextLink href='/login'>
                      <Button className={classes.login} variant='outlined'>
                        Login
                      </Button>
                    </NextLink>
                    <NextLink href='/register'>
                      <Button
                        className={classes.register}
                        variant='outlined'
                        color='secondary'
                      >
                        Register
                      </Button>
                    </NextLink>
                  </div>
                  <div className={classes.sectionMobile}>
                    <IconButton
                      aria-label='show more'
                      aria-controls={mobileMenuIdUnregistered}
                      aria-haspopup='true'
                      onClick={handleUnregisteredMobileMenuOpen}
                      color='inherit'
                    >
                      <MoreHorizIcon />
                    </IconButton>
                  </div>
                </>
              ) : (
                /* user logged in */ <>
                  <div className={classes.sectionDesktop}>
                    <IconButton aria-label='show 4 new mails' color='inherit'>
                      <Badge badgeContent={null} color='secondary'>
                        <AddIcon />
                      </Badge>
                    </IconButton>
                    <IconButton
                      aria-label='show 17 new notifications'
                      color='inherit'
                    >
                      <Badge badgeContent={4} color='secondary'>
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                    <IconButton
                      edge='end'
                      aria-label='account of current user'
                      aria-controls={menuId}
                      aria-haspopup='true'
                      onClick={handleProfileMenuOpen}
                      color='inherit'
                    >
                      <AccountCircle />
                    </IconButton>
                  </div>
                  <div className={classes.sectionMobile}>
                    <IconButton
                      aria-label='show more'
                      aria-controls={mobileMenuId}
                      aria-haspopup='true'
                      onClick={handleMobileMenuOpen}
                      color='inherit'
                    >
                      <MoreHorizIcon />
                    </IconButton>
                  </div>
                </>
              )}
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMobileMenuUnregistered}
        {renderMenu}
      </Paper>
      <IndexDrawer
        isDrawerOpen={open}
        isProjectOpen={openProjects}
        isBookmarksOpen={openBookmarks}
        handleProjectsClick={handleProjectsClick}
        handleBookmarksClick={handleBookmarksClick}
      />
      <main className={classes.content}></main>
    </div>
  );
};
