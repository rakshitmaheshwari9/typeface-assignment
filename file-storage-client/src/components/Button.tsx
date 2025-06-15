import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

interface ButtonProps extends MuiButtonProps {
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, fullWidth = false, ...props }) => {
  return (
    <MuiButton
      fullWidth={fullWidth}
      variant="contained"
      color="primary"
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button; 