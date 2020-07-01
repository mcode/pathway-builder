import React, { FC, memo, ReactNode } from 'react';

import TextField from '@material-ui/core/TextField';

interface InputComponentProps {
  children?: ReactNode;
}

const InputComponent: FC<InputComponentProps> = ({ children }) => {
  return <div>{children}</div>;
};

interface OutlinedDivProps {
  children: ReactNode;
  label: string;
  error: boolean;
}

const OutlinedDiv: FC<OutlinedDivProps> = ({ children, label, error }) => {
  return (
    <TextField
      variant="outlined"
      label={label}
      error={error}
      multiline
      InputLabelProps={{ shrink: true }}
      InputProps={{
        inputComponent: InputComponent
      }}
      inputProps={{ children: children }}
    />
  );
};

export default memo(OutlinedDiv);
