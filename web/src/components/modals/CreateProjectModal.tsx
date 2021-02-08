import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useFormik } from 'formik';
import { Checkbox, TextareaAutosize, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { useCreateProjectMutation } from '../../generated/graphql';
import { useRouter } from 'next/router';
import { DropzoneArea } from 'material-ui-dropzone';
import { toErrorMap } from '../../utils/toErrorMap';

interface CreateProjectModalProps {
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
    create: {
      textTransform: 'unset',
      color: theme.palette.common.white,
      minWidth: '90px',
      fontWeight: 'bold',
    },
    cancel: {
      marginRight: theme.spacing(1),
      borderColor: theme.palette.common.white,
      textTransform: 'unset',
      minWidth: '90px',
      fontWeight: 'bold',
    },
  })
);

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const classes = useStyles();
  const [createProject] = useCreateProjectMutation();
  const [img, setImg] = useState(null);
  const router = useRouter();

  const formik = useFormik({
    initialValues: { name: '', desc: '', skillIds: [], categoryIds: [] },
    onSubmit: async (values, { setErrors }) => {
      const response = await createProject({
        variables: {attributes:{
          name: values.name, 
          desc: values.desc,
          skillIds: values.skillIds,
          categoryIds: values.categoryIds,
          thumbnail: img,
        }
        },
        update: (cache: any) => {
          cache.evict({ fieldName: 'projects:{}' });
        },
      });
      if (response.data?.createProject.errors) {
        setErrors(toErrorMap(response.data.createProject.errors));
      } else if (response.data?.createProject.project) {
        onClose();
        router.push('/');
      }
    },
  });

  const getSkillsSelected = (
    _event: any,
    skills: { id: number; type: string }[]
  ) => {
    formik.values.skillIds = [];
    for (let i = 0; i < skills.length; i++) {
      //@ts-ignore
      formik.values.skillIds.push(skills[i].id);
    }
  };

  const getCategoriesSelected = (
    _event: any,
    categories: { id: number; name: string }[]
  ) => {
    formik.values.categoryIds = [];
    for (let i = 0; i < categories.length; i++) {
      //@ts-ignore
      formik.values.categoryIds.push(categories[i].id);
    }
  };

  const handleChange = (file: any) => {
    if (file.length === 0) setImg(null);
    setImg(file[0]);
  };
  const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
  const checkedIcon = <CheckBoxIcon fontSize='small' />;

  const categories = [
    { id: 3, name: 'SEG 3501' },
    { id: 4, name: 'SEG 2910' },
  ];

  const skills = [
    { id: 4, type: 'Fr' },
    { id: 5, type: 'En' },
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth={'sm'}>
      <DialogTitle className={classes.modalTitle}>
        Create a new project
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent className={classes.modalContent}>
          <Typography color='textSecondary'>Project thumbnail: </Typography>
          <DropzoneArea
            acceptedFiles={['image/*']}
            filesLimit={1}
            dropzoneText={'Drag and drop an image here or click'}
            onChange={handleChange}
            showPreviews={true}
            showPreviewsInDropzone={false}
            previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
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
            placeholder='Description'
            onChange={formik.handleChange}
            value={formik.values.desc}
            multiline
          />
          <Autocomplete
            multiple
            size='small'
            id='categories'
            options={categories}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            onChange={getCategoriesSelected}
            renderOption={(option, { selected }) => (
              <>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.name}
              </>
            )}
            style={{ width: '100%', marginTop: '8px' }}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!formik.errors.categoryIds}
                helperText={formik.errors.categoryIds}
                variant='outlined'
                label='Class(es)'
                placeholder='Class(es)'
                onChange={formik.handleChange}
              />
            )}
          />
          <Autocomplete
            multiple
            size='small'
            id='skills'
            options={skills}
            disableCloseOnSelect
            getOptionLabel={(option) => option.type}
            onChange={getSkillsSelected}
            renderOption={(option, { selected }) => (
              <>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.type}
              </>
            )}
            style={{ width: '100%', marginTop: '12px' }}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!formik.errors.skillIds}
                helperText={formik.errors.skillIds}
                variant='outlined'
                label='Language(s)'
                placeholder='Language(s)'
                onChange={formik.handleChange}
                value={formik.values.skillIds}
              />
            )}
          />
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
            className={classes.create}
            color='secondary'
            variant='outlined'
          >
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
