import React from 'react';
import { Wrapper } from './Wrapper';
import { NavBar } from './navigation/NavBar';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

interface LayoutProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
  })
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <NavBar />
      <Wrapper>{children}</Wrapper>
    </div>
  );
};
