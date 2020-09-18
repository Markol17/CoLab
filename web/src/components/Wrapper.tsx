import React from 'react';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

interface WrapperProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      flexGrow: 1,
      paddingTop: theme.spacing(11),
      paddingBottom: theme.spacing(11),
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),
    },
  })
);

export const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  const classes = useStyles();
  return <Box className={classes.content}>{children}</Box>;
};
