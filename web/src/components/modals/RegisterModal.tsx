import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { useFormik } from 'formik';
import CloseIcon from '@material-ui/icons/Close';
import {
	CurrentUserDocument,
	CurrentUserQuery,
	useRegisterMutation,
	useSchoolProgramsQuery,
	useSchoolsQuery,
} from '../../generated/graphql';
import { useRouter } from 'next/router';
import { toErrorMap } from '../../utils/toErrorMap';
import { CircularProgress, IconButton, InputAdornment, Typography } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

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
		datePickers: {
			display: 'flex',
		},
		leftDatePicker: {
			marginRight: '12px',
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
	const [schoolId, setSchoolId] = useState(-1);
	const [programOptions, setProgramOptions] = useState([]);
	const { data: schoolsData, loading: schoolsLoading } = useSchoolsQuery();
	const { data: programsData, loading: programsLoading } = useSchoolProgramsQuery({
		variables: {
			schoolId: schoolId,
		},
	});
	useEffect(() => {
		let programs: any = [];
		if (schoolId !== -1 && !programsLoading) {
			for (let i = 0; i < programsData!.schoolPrograms!.programs!.length; i++) {
				programs.push(programsData!.schoolPrograms!.programs![i]);
			}
			//@ts-ignore
			setProgramOptions(sortOptions(programs));
		} else {
			setProgramOptions(programs);
		}
	}, [programsData]);

	const sortOptions = (options: any[]) => {
		const temp = options.map((option) => {
			const firstLetter = option.name[0].toUpperCase();
			return {
				firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
				...option,
			};
		});
		return temp;
	};
	const schoolOptions = schoolsLoading ? [] : sortOptions(schoolsData!.schools!.schools!);

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const handleSchoolChange = (_event: any, school: any) => {
		if (!school) {
			formik.setFieldValue('schoolId', -1);
			setSchoolId(-1);
		} else {
			formik.setFieldValue('schoolId', school.id);
			setSchoolId(school.id);
		}
	};

	const handleProgramChange = (_event: any, program: any) => {
		if (!program) {
			formik.setFieldValue('programId', -1);
		} else {
			formik.setFieldValue('programId', program.id);
		}
	};
	const handleStartDateChange = (_event: any, date: any) => {
		const startDate = new Date(date);
		formik.setFieldValue('startDateOfStudy', startDate);
	};
	const handleExpectedDateChange = (_event: any, date: any) => {
		const expectedDate = new Date(date);
		formik.setFieldValue('expectedGraduationDate', expectedDate);
	};

	const formik = useFormik({
		initialValues: {
			email: '',
			username: '',
			password: '',
			firstName: '',
			lastName: '',
			startDateOfStudy: new Date(),
			expectedGraduationDate: new Date(),
			schoolId: -1,
			programId: -1,
		},
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
						label='Email*'
						type='email'
						fullWidth
						name='email'
						placeholder='Email*'
						onChange={formik.handleChange}
						value={formik.values.email}
						color='secondary'
					/>
					<TextField
						error={!!formik.errors.firstName}
						helperText={formik.errors.firstName}
						variant='outlined'
						margin='dense'
						label='First Name*'
						type='text'
						fullWidth
						name='firstName'
						placeholder='First Name*'
						onChange={formik.handleChange}
						value={formik.values.firstName}
						color='secondary'
					/>
					<TextField
						error={!!formik.errors.lastName}
						helperText={formik.errors.lastName}
						variant='outlined'
						margin='dense'
						label='Last Name*'
						type='text'
						fullWidth
						name='lastName'
						placeholder='Last Name*'
						onChange={formik.handleChange}
						value={formik.values.lastName}
						color='secondary'
					/>
					<TextField
						error={!!formik.errors.username}
						helperText={formik.errors.username}
						variant='outlined'
						margin='dense'
						label='Username*'
						type='text'
						fullWidth
						name='username'
						placeholder='Username*'
						onChange={formik.handleChange}
						value={formik.values.username}
						color='secondary'
					/>
					<TextField
						error={!!formik.errors.password}
						helperText={formik.errors.password}
						variant='outlined'
						margin='dense'
						label='Password*'
						type={showPassword ? 'text' : 'password'}
						fullWidth
						name='password'
						placeholder='Password*'
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
					{schoolsLoading || !schoolOptions ? (
						<CircularProgress color='secondary' />
					) : (
						<>
							<Autocomplete
								options={schoolOptions!.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
								groupBy={(schoolOption) => schoolOption.firstLetter}
								getOptionLabel={(schoolOption) => schoolOption.name}
								size='small'
								onChange={handleSchoolChange}
								style={{ width: '100%' }}
								renderInput={(params) => (
									<TextField
										{...params}
										error={!!formik.errors.schoolId}
										helperText={formik.errors.schoolId}
										label='School*'
										placeholder='School*'
										variant='outlined'
										color='secondary'
										margin='dense'
									/>
								)}
							/>
						</>
					)}
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<div className={classes.datePickers}>
							<KeyboardDatePicker
								error={!!formik.errors.startDateOfStudy}
								helperText={formik.errors.startDateOfStudy}
								disableToolbar
								variant='inline'
								format='MM/dd/yyyy'
								margin='dense'
								name='startDateOfStudy'
								label='Start Date Of Study*'
								placeholder='Start Date Of Study*'
								value={formik.values.startDateOfStudy}
								onChange={handleStartDateChange}
								inputVariant='outlined'
								className={classes.leftDatePicker}
								color='secondary'
							/>
							<KeyboardDatePicker
								error={!!formik.errors.expectedGraduationDate}
								helperText={formik.errors.expectedGraduationDate}
								disableToolbar
								variant='inline'
								format='MM/dd/yyyy'
								margin='dense'
								name='expectedGraduationDate'
								label='Expected Graduation Date*'
								placeholder='Expected Graduation Date*'
								value={formik.values.expectedGraduationDate}
								onChange={handleExpectedDateChange}
								inputVariant='outlined'
								color='secondary'
							/>
						</div>
					</MuiPickersUtilsProvider>
					<Autocomplete
						options={programOptions!.sort(
							(a: { firstLetter: any }, b: { firstLetter: string }) => -b.firstLetter.localeCompare(a.firstLetter)
						)}
						groupBy={(schoolOption: any) => schoolOption.firstLetter}
						getOptionLabel={(schoolOption) => schoolOption.name}
						size='small'
						disabled={programOptions.length === 0}
						onChange={handleProgramChange}
						style={{ width: '100%' }}
						renderInput={(params) => (
							<TextField
								{...params}
								error={!!formik.errors.programId}
								helperText={formik.errors.programId}
								label='Program*'
								placeholder='Program*'
								variant='outlined'
								color='secondary'
								margin='dense'
							/>
						)}
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
