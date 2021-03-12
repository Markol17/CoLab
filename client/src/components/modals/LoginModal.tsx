import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { useFormik } from 'formik';
import { CurrentUserDocument, CurrentUserQuery, useLoginMutation } from '../../generated/graphql';
import { useRouter } from 'next/router';
import { toErrorMap } from '../../utils/toErrorMap';
import { IconButton, InputAdornment, Typography, withStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Visibility, VisibilityOff } from '@material-ui/icons';

interface LoginModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
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
		cancel: {
			marginRight: theme.spacing(1),
			borderColor: theme.palette.error.main,
			textTransform: 'unset',
			minWidth: '90px',
			boxShadow: '3px 2px 9px 0px rgba(0,0,0,0.15)',
			fontWeight: 'bold',
		},
	})
);

const headerStyles = (theme: Theme) =>
	createStyles({
		root: {
			margin: 0,
			padding: theme.spacing(3),
		},
		closeButton: {
			position: 'absolute',
			right: theme.spacing(2),
			top: theme.spacing(2),
		},
		title: {
			fontWeight: 'bold',
		},
	});

const DialogTitle = withStyles(headerStyles)((props: any) => {
	const { children, classes, onClose } = props;
	return (
		<MuiDialogTitle disableTypography className={classes.root}>
			<Typography variant='h5' className={classes.title}>
				{children}
			</Typography>
			{onClose ? (
				<IconButton aria-label='close' className={classes.closeButton} onClick={onClose}>
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
	const classes = useStyles();
	const [login] = useLoginMutation();
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const formik = useFormik({
		initialValues: { usernameOrEmail: '', password: '' },
		onSubmit: async (values, { setErrors }) => {
			const response = await login({
				variables: { attributes: values },
				update: (cache, { data }) => {
					cache.writeQuery<CurrentUserQuery>({
						query: CurrentUserDocument,
						data: {
							__typename: 'Query',
							currentUser: data?.login.user,
						},
					});
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
			<DialogTitle onClose={onClose}>Login</DialogTitle>
			<form onSubmit={formik.handleSubmit}>
				<DialogContent className={classes.modalContent}>
					<TextField
						autoFocus
						error={!!formik.errors.usernameOrEmail}
						helperText={formik.errors.usernameOrEmail}
						variant='outlined'
						margin='dense'
						label='Username or Email*'
						type='text'
						color='secondary'
						fullWidth
						name='usernameOrEmail'
						placeholder='Username or Email*'
						onChange={formik.handleChange}
						value={formik.values.usernameOrEmail}
					/>
					<TextField
						error={!!formik.errors.password}
						helperText={formik.errors.password}
						variant='outlined'
						color='secondary'
						margin='dense'
						label='Password*'
						type={showPassword ? 'text' : 'password'}
						fullWidth
						name='password'
						placeholder='Password*'
						onChange={formik.handleChange}
						value={formik.values.password}
						InputProps={{
							endAdornment: (
								<InputAdornment position='end'>
									<IconButton
										aria-label='toggle password visibility'
										onClick={handleClickShowPassword}
										onMouseDown={handleMouseDownPassword}
										edge='end'>
										{showPassword ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</DialogContent>
				<DialogActions className={classes.modalActions}>
					<Button onClick={onClose} variant='outlined' className={classes.cancel}>
						Cancel
					</Button>
					<Button
						type='submit'
						disabled={formik.isSubmitting}
						className={classes.login}
						color='secondary'
						variant='outlined'>
						Login
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};
