import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface InputProps extends Omit<TextFieldProps, 'variant'> {
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({ fullWidth = true, ...props }) => {
  return (
    <TextField
      variant="outlined"
      fullWidth={fullWidth}
      margin="normal"
      {...props}
    />
  );
};

export default Input; 