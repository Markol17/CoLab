import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useFormik } from 'formik';

import {
  MeDocument,
  MeQuery,
  useRegisterMutation,
} from '../../generated/graphql';
import { useRouter } from 'next/router';

import { toErrorMap } from '../../utils/toErrorMap';

interface RegisterModalProps {
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
      padding: theme.spacing(1, 3, 1, 3),
    },
    register: {
      textTransform: 'unset',
      minWidth: '90px',
      borderWidth: '2px',
      fontWeight: 'bold',
      '&:hover': {
        borderWidth: '2px',
      },
    },
    cancel: {
      marginRight: theme.spacing(2),
      borderColor: theme.palette.error.main,
      textTransform: 'unset',
      minWidth: '90px',
      fontWeight: 'bold',
      borderWidth: '2px',
      '&:hover': {
        borderWidth: '2px',
      },
    },
  })
);

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const classes = useStyles();
  const [register] = useRegisterMutation();
  const router = useRouter();

  const formik = useFormik({
    initialValues: { email: '', username: '', password: '' },
    onSubmit: async (values, { setErrors }) => {
      const response = await register({
        variables: { options: values },
        update: (cache, { data }) => {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              __typename: 'Query',
              me: data?.register.user,
            },
          });
        },
      });
      if (response.data?.register.errors) {
        setErrors(toErrorMap(response.data.register.errors));
      } else if (response.data?.register.user) {
        // worked
        router.push('/');
      }
    },
  });

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth={'sm'}>
      <DialogTitle className={classes.modalTitle}>Register</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent className={classes.modalContent}>
          <TextField
            margin='dense'
            label='Email'
            type='email'
            fullWidth
            name='email'
            placeholder='Email'
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          <TextField
            margin='dense'
            label='Username'
            type='text'
            fullWidth
            name='username'
            placeholder='Username'
            onChange={formik.handleChange}
            value={formik.values.username}
          />
          <TextField
            margin='dense'
            label='Password'
            type='password'
            fullWidth
            name='password'
            placeholder='Password'
            onChange={formik.handleChange}
            value={formik.values.password}
          />
        </DialogContent>
        <DialogActions className={classes.modalActions}>
          <Button onClick={onClose} className={classes.register}>
            Cancel
          </Button>
          <Button
            type='submit'
            disabled={formik.isSubmitting}
            className={classes.register}
            color='secondary'
            variant='outlined'
          >
            Register
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
