// import React, { InputHTMLAttributes } from 'react';
// import { useField } from 'formik';
// import { FormControl, FormLabel, Input, TextField } from '@material-ui/core';

// type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
//   label: string;
//   name: string;
//   textarea?: boolean;
// };

// // '' => false
// // 'error message stuff' => true

// export const InputField: React.FC<InputFieldProps> = ({
//   label,
//   textarea,
//   size: _,
//   ...props
// }) => {
//   let InputOrTextarea = Input;
//   if (textarea) {
//     InputOrTextarea = TextField;
//   }
//   const [field, { error }] = useField(props);
//   return (
//     <FormControl isInvalid={!!error}>
//       <FormLabel htmlFor={field.name}>{label}</FormLabel>
//       <InputOrTextarea {...field} {...props} id={field.name} />
//     </FormControl>
//   );
// };
