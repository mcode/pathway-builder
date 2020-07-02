import React, { FC, ReactNode } from 'react';
import clsx from 'clsx';

import TextField from '@material-ui/core/TextField';
import useStyles from './styles';

interface InputComponentProps {
  children?: ReactNode;
}

const InputComponent: FC<InputComponentProps> = ({ children }) => {
  return <>{children}</>;
};

interface OutlinedDivProps {
  children: ReactNode;
  label: string;
  error: boolean;
}

const OutlinedDiv: FC<OutlinedDivProps> = ({ children, label, error }) => {
  const styles = useStyles();

  return (
    <TextField
      variant="outlined"
      label={label}
      multiline
      InputLabelProps={{ shrink: true }}
      InputProps={{
        inputComponent: InputComponent,
        classes: {
          root: clsx(styles.outlinedDiv, error && styles.outlinedDivError),
          notchedOutline: clsx(error && styles.outlinedDivError)
        }
      }}
      inputProps={{ children }}
    />
  );
};

// This is not memoized since one of its props is children
export default OutlinedDiv;
