import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useFormik } from 'formik';
import { Checkbox } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { useCreateProjectMutation } from '../../generated/graphql';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    create: {
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

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const classes = useStyles();
  const [createProject] = useCreateProjectMutation();

  const formik = useFormik({
    initialValues: { name: '', desc: '', skillIds: [], categoryIds: [] },
    onSubmit: async (values) => {
      const { errors } = await createProject({
        variables: {
          input: values,
          skillIds: values.skillIds,
          categoryIds: values.categoryIds,
        },
        update: (cache: any) => {
          cache.evict({ fieldName: 'posts:{}' });
        },
      });
      if (!errors) {
        // router.push('/');
      }
    },
  });

  const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
  const checkedIcon = <CheckBoxIcon fontSize='small' />;

  const categories = [
    { id: 1, name: 'Tech' },
    { id: 2, name: 'Science' },
  ];

  const skills = [
    { id: 1, type: 'SWE' },
    { id: 2, type: 'Comm' },
    { id: 3, type: 'Bus' },
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>Create a new project</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextField
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
            margin='dense'
            label='Description'
            type='text'
            fullWidth
            name='desc'
            placeholder='Description'
            onChange={formik.handleChange}
            value={formik.values.desc}
          />
          <Autocomplete
            multiple
            id='categories'
            options={categories}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
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
            style={{ width: 500 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Categories'
                placeholder='Categories'
              />
            )}
          />
          <Autocomplete
            multiple
            id='skills'
            options={skills}
            disableCloseOnSelect
            getOptionLabel={(option) => option.type}
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
            style={{ width: 500 }}
            renderInput={(params) => (
              <TextField {...params} label='Skills' placeholder='Skills' />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} className={classes.create}>
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
