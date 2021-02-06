import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useFormik } from 'formik';

import { MeDocument, MeQuery, useLoginMutation } from '../../generated/graphql';
import { useRouter } from 'next/router';

import { toErrorMap } from '../../utils/toErrorMap';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modalTitle: {
      padding: theme.spacing(3, 3, 0, 3),
    },
    modalContent: {
      padding: theme.spacing(0, 3, 2, 3),
    },
    modalActions: {
      padding: theme.spacing(1, 3, 2, 3),
    },
    login: {
      textTransform: 'unset',
      color: theme.palette.common.white,
      minWidth: '90px',
      boxShadow: '3px 2px 9px 0px rgba(0,0,0,0.15)',
      fontWeight: 'bold',
    },
    login2: {
      textTransform: 'unset',
      color: theme.palette.common.white,
      minWidth: '90px',
      marginTop: '10px',
      boxShadow: '3px 2px 9px 0px rgba(0,0,0,0.15)',
      fontWeight: 'bold',
    },
    cancel: {
      marginRight: theme.spacing(1),
      borderColor: theme.palette.common.white,
      textTransform: 'unset',
      minWidth: '90px',
      boxShadow: '3px 2px 9px 0px rgba(0,0,0,0.15)',
      fontWeight: 'bold',
    },
  })
);

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const classes = useStyles();
  const [login] = useLoginMutation();
  const router = useRouter();

  const formik = useFormik({
    initialValues: { usernameOrEmail: '', password: '' },
    onSubmit: async (values, { setErrors }) => {
      const response = await login({
        variables: values,
        update: (cache, { data }) => {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              __typename: 'Query',
              me: data?.login.user,
            },
          });
          cache.evict({ fieldName: 'projects:{}' });
        },
      });
      if (response.data?.login.errors) {
        setErrors(toErrorMap(response.data.login.errors));
      } else if (response.data?.login.user) {
        if (typeof router.query.next === 'string') {
          router.push(router.query.next);
        } else {
          onClose();
          router.push('/');
        }
      }
    },
  });

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth={'sm'}>
      <DialogTitle className={classes.modalTitle}>Login</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent className={classes.modalContent}>
          <TextField
            error={!!formik.errors.usernameOrEmail}
            helperText={formik.errors.usernameOrEmail}
            variant='outlined'
            margin='dense'
            label='Username Or Email'
            type='text'
            fullWidth
            name='usernameOrEmail'
            placeholder='Username Or Email'
            onChange={formik.handleChange}
            value={formik.values.usernameOrEmail}
          />
          <TextField
            error={!!formik.errors.password}
            helperText={formik.errors.password}
            variant='outlined'
            margin='dense'
            label='Password'
            type='password'
            fullWidth
            name='password'
            placeholder='Password'
            onChange={formik.handleChange}
            value={formik.values.password}
          />
               <Button
          disabled={formik.isSubmitting}
          className={classes.login2}
          color='secondary'
          variant='outlined'
          >
            Login with uOttawa
          </Button>
        </DialogContent>
        <DialogActions className={classes.modalActions}>
          <Button
            onClick={onClose}
            variant='outlined'
            className={classes.cancel}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            disabled={formik.isSubmitting}
            className={classes.login}
            color='secondary'
            variant='outlined'
          >
            Login
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
