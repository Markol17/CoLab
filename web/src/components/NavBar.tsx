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

const drawerWidth = 240;

interface NavBarProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
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
  })
);

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
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
        </Toolbar>
      </AppBar>
      <IndexDrawer handleDrawerClose={handleDrawerClose} isOpen={open} />
      <main className={classes.content}></main>
    </div>
  );
};
