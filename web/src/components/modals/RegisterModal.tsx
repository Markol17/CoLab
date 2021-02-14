import React, { useState } from 'react';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { useFormik } from 'formik';
import CloseIcon from '@material-ui/icons/Close';
import { CurrentUserDocument, CurrentUserQuery, useRegisterMutation } from '../../generated/graphql';
import { useRouter } from 'next/router';
import { toErrorMap } from '../../utils/toErrorMap';
import { IconButton, InputAdornment, Typography } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

interface RegisterModalProps {
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
		register: {
			textTransform: 'unset',
			color: theme.palette.common.white,
			minWidth: '90px',
			fontWeight: 'bold',
			boxShadow: '3px 2px 9px 0px rgba(0,0,0,0.15)',
		},
		cancel: {
			marginRight: theme.spacing(1),
			borderColor: theme.palette.error.main,
			textTransform: 'unset',
			minWidth: '90px',
			fontWeight: 'bold',
			boxShadow: '3px 2px 9px 0px rgba(0,0,0,0.15)',
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
			<Typography className={classes.title} variant='h5'>
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

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
	const classes = useStyles();
	const [register] = useRegisterMutation();
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const formik = useFormik({
		initialValues: { email: '', username: '', password: '' },
		onSubmit: async (values, { setErrors }) => {
			const response = await register({
				variables: { attributes: values },
				update: (cache, { data }) => {
					cache.writeQuery<CurrentUserQuery>({
						query: CurrentUserDocument,
						data: {
							__typename: 'Query',
							currentUser: data?.register.user,
						},
					});
				},
			});
			if (response.data?.register.errors) {
				setErrors(toErrorMap(response.data.register.errors));
			} else if (response.data?.register.user) {
				onClose();
				router.push('/');
			}
		},
	});

	return (
		<Dialog open={isOpen} onClose={onClose} fullWidth maxWidth={'sm'}>
			<DialogTitle onClose={onClose}>Register</DialogTitle>
			<form onSubmit={formik.handleSubmit}>
				<DialogContent className={classes.modalContent}>
					<TextField
						autoFocus
						error={!!formik.errors.email}
						helperText={formik.errors.email}
						variant='outlined'
						margin='dense'
						label='Email'
						type='email'
						fullWidth
						name='email'
						placeholder='Email'
						onChange={formik.handleChange}
						value={formik.values.email}
						color='secondary'
					/>
					<TextField
						error={!!formik.errors.username}
						helperText={formik.errors.username}
						variant='outlined'
						margin='dense'
						label='Username'
						type='text'
						fullWidth
						name='username'
						placeholder='Username'
						onChange={formik.handleChange}
						value={formik.values.username}
						color='secondary'
					/>
					<TextField
						error={!!formik.errors.password}
						helperText={formik.errors.password}
						variant='outlined'
						margin='dense'
						label='Password'
						type={showPassword ? 'text' : 'password'}
						fullWidth
						name='password'
						placeholder='Password'
						onChange={formik.handleChange}
						value={formik.values.password}
						color='secondary'
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
						className={classes.register}
						color='secondary'
						variant='outlined'>
						Register
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};
