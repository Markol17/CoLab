import React from 'react';
import Box from '@material-ui/core/Box';

interface WrapperProps {}

export const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return <Box mt={8}>{children}</Box>;
};
