// import React from 'react';
// import { Box, Link, Flex, Button, Heading } from '@chakra-ui/core';
// import NextLink from 'next/link';
// import { useMeQuery, useLogoutMutation } from '../generated/graphql';
// import { isServer } from '../utils/isServer';
// import { useRouter } from 'next/router';
// import { useApolloClient } from '@apollo/client';

// interface NavBarProps {}

// export const NavBar: React.FC<NavBarProps> = ({}) => {
//   const router = useRouter();
//   const [logout, { loading: logoutFetching }] = useLogoutMutation();
//   const apolloClient = useApolloClient();
//   const { data, loading } = useMeQuery({
//     skip: isServer(),
//   });

//   let body = null;

//   // data is loading
//   if (loading) {
//     // user not logged in
//   } else if (!data?.me) {
//     body = (
//       <>
//         <NextLink href='/login'>
//           <Link mr={2}>login</Link>
//         </NextLink>
//         <NextLink href='/register'>
//           <Link>register</Link>
//         </NextLink>
//       </>
//     );
//     // user is logged in
//   } else {
//     body = (
//       <Flex align='center'>
//         <NextLink href='/create-post'>
//           <Button as={Link} mr={4}>
//             create post
//           </Button>
//         </NextLink>
//         <Box mr={2}>{data.me.username}</Box>
//         <Button
//           onClick={async () => {
//             await logout();
//             await apolloClient.resetStore();
//           }}
//           isLoading={logoutFetching}
//           variant='link'
//         >
//           logout
//         </Button>
//       </Flex>
//     );
//   }

//   return (
//     <Flex zIndex={1} position='sticky' top={0} p={4}>
//       <Flex flex={1} m='auto' align='center' maxW={800}>
//         <NextLink href='/'>
//           <Link>
//             <Heading>Test App</Heading>
//           </Link>
//         </NextLink>
//         <Box ml={'auto'}>{body}</Box>
//       </Flex>
//     </Flex>
//   );
// };

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
  Link,
  Divider,
} from '@material-ui/core';

import { useApolloClient } from '@apollo/client';
import NextLink from 'next/link';
import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import { isServer } from '../utils/isServer';

import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import SearchIcon from '@material-ui/icons/Search';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { RenderPromises } from '@apollo/client/react/ssr';

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
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
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
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
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
  })
);

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [
    mobileMoreAnchorEl,
    setMobileMoreAnchorEl,
  ] = React.useState<null | HTMLElement>(null);

  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });
  const [logout, { loading: logoutFetching }] = useLogoutMutation();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const logoutUser = async () => {
    await logout();
    await apolloClient.resetStore();
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
      <MenuItem onClick={logoutUser}>Logout</MenuItem>
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
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
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

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Paper elevation={3}>
        <AppBar
          position='fixed'
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={handleDrawerOpen}
              edge='start'
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' noWrap>
              Colab
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder='Search…'
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
            {loading ? null /* data loading */ : !data?.me ? (
              /*user not logged in*/ <>
                <NextLink href='/login'>
                  <Link>login</Link>
                </NextLink>
                <NextLink href='/register'>
                  <Link>register</Link>
                </NextLink>
              </>
            ) : (
              /* user logged in */ <>
                <div className={classes.grow} />
                <div className={classes.sectionDesktop}>
                  <IconButton aria-label='show 4 new mails' color='inherit'>
                    <Badge badgeContent={null} color='secondary'>
                      <MailIcon />
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
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </Paper>
      <IndexDrawer handleDrawerClose={handleDrawerClose} isOpen={open} />
      <main className={classes.content}></main>
    </div>
  );
};
