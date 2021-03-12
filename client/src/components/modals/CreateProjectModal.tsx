import React, { useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { useFormik } from "formik";
import { Checkbox, CircularProgress, IconButton, Typography, withStyles } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import {
	CurrentUserDocument,
	useCategoriesQuery,
	useCreateProjectMutation,
	useSkillsQuery,
} from "../../generated/graphql";
import { useRouter } from "next/router";
import { DropzoneArea } from "material-ui-dropzone";
import { toErrorMap } from "../../utils/toErrorMap";
import CloseIcon from "@material-ui/icons/Close";

interface CreateProjectModalProps {
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
		create: {
			textTransform: "unset",
			color: theme.palette.common.white,
			minWidth: "90px",
			fontWeight: "bold",
		},
		cancel: {
			marginRight: theme.spacing(1),
			borderColor: theme.palette.error.main,
			textTransform: "unset",
			minWidth: "90px",
			fontWeight: "bold",
		},
		subtitles: {
			fontWeight: "bold",
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
			position: "absolute",
			right: theme.spacing(2),
			top: theme.spacing(2),
		},
		title: {
			fontWeight: "bold",
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

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
	const classes = useStyles();
	const [createProject] = useCreateProjectMutation();
	const [img, setImg] = useState(null);
	const router = useRouter();
	const { data: skillsData, loading: skillsLoading } = useSkillsQuery();
	const { data: categoriesData, loading: categoriesLoading } = useCategoriesQuery();

	const formik = useFormik({
		initialValues: { name: "", desc: "", skillIds: [], categoryIds: [] },
		onSubmit: async (values, { setErrors }) => {
			const response = await createProject({
				variables: {
					attributes: {
						name: values.name,
						desc: values.desc,
						skillIds: values.skillIds,
						categoryIds: values.categoryIds,
						thumbnail: img,
					},
				},
				refetchQueries: [
					{
						query: CurrentUserDocument,
					},
				],
			});
			if (response.data?.createProject.errors) {
				setErrors(toErrorMap(response.data.createProject.errors));
			} else if (response.data?.createProject.project) {
				onClose();
				router.push("/");
			}
		},
	});

	const getSkillsSelected = (_event: any, skills: { id: number; type: string }[]) => {
		let skillIds = [];
		for (let i = 0; i < skills.length; i++) {
			skillIds.push(skills[i].id);
		}
		formik.setFieldValue("skillIds", skillIds);
	};

	const getCategoriesSelected = (_event: any, categories: { id: number; name: string }[]) => {
		let categoryIds = [];
		for (let i = 0; i < categories.length; i++) {
			categoryIds.push(categories[i].id);
		}
		formik.setFieldValue("categoryIds", categoryIds);
	};

	const handleChange = (file: any) => {
		if (file.length === 0) setImg(null);
		setImg(file[0]);
	};
	const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
	const checkedIcon = <CheckBoxIcon fontSize='small' />;

	return (
		<Dialog open={isOpen} onClose={onClose} fullWidth maxWidth={"sm"}>
			<DialogTitle onClose={onClose}>Create a new project</DialogTitle>
			<form onSubmit={formik.handleSubmit}>
				<DialogContent className={classes.modalContent}>
					<Typography gutterBottom className={classes.subtitles} variant='subtitle1'>
						Thumbnail
					</Typography>
					<DropzoneArea
						acceptedFiles={["image/jpeg", "image/png"]}
						filesLimit={1}
						dropzoneText={"Drag and drop an image here or click"}
						onChange={handleChange}
						showPreviews={true}
						showPreviewsInDropzone={false}
						previewGridProps={{ container: { spacing: 1, direction: "row" } }}
						previewText='Selected Image:'
					/>
					<TextField
						error={!!formik.errors.name}
						helperText={formik.errors.name}
						variant='outlined'
						margin='dense'
						label='Name'
						type='text'
						fullWidth
						name='name'
						color='secondary'
						placeholder='Name'
						onChange={formik.handleChange}
						value={formik.values.name}
					/>
					<TextField
						error={!!formik.errors.desc}
						helperText={formik.errors.desc}
						variant='outlined'
						margin='dense'
						label='Description'
						type='text'
						fullWidth
						name='desc'
						color='secondary'
						placeholder='Description'
						onChange={formik.handleChange}
						value={formik.values.desc}
						multiline
					/>
					{categoriesLoading ? (
						<CircularProgress color='secondary' />
					) : (
						<>
							<Autocomplete
								multiple
								size='small'
								id='categories'
								//@ts-ignore
								options={categoriesData?.categories?.categories}
								disableCloseOnSelect
								getOptionLabel={(option) => option.name}
								onChange={getCategoriesSelected}
								renderOption={(option, { selected }) => (
									<>
										<Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
										{option.name}
									</>
								)}
								style={{ width: "100%", marginTop: "8px" }}
								renderInput={(params) => (
									<TextField
										{...params}
										error={!!formik.errors.categoryIds}
										helperText={formik.errors.categoryIds}
										variant='outlined'
										label='Category(ies)'
										placeholder='Category(ies)'
										color='secondary'
									/>
								)}
							/>
						</>
					)}
					{skillsLoading ? (
						<CircularProgress color='secondary' />
					) : (
						<>
							<Autocomplete
								multiple
								size='small'
								id='skills'
								//@ts-ignore
								options={skillsData?.skills?.skills}
								disableCloseOnSelect
								getOptionLabel={(option) => option.type}
								onChange={getSkillsSelected}
								renderOption={(option, { selected }) => (
									<>
										<Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
										{option.type}
									</>
								)}
								style={{ width: "100%", marginTop: "12px" }}
								renderInput={(params) => (
									<TextField
										{...params}
										error={!!formik.errors.skillIds}
										helperText={formik.errors.skillIds}
										variant='outlined'
										label='Skill(s)'
										placeholder='Skill(s)'
										color='secondary'
									/>
								)}
							/>
						</>
					)}
				</DialogContent>
				<DialogActions className={classes.modalActions}>
					<Button onClick={onClose} variant='outlined' className={classes.cancel}>
						Cancel
					</Button>
					<Button
						type='submit'
						disabled={formik.isSubmitting}
						className={classes.create}
						color='secondary'
						variant='outlined'>
						Create
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};
