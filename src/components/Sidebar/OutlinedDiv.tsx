import React from 'react';

import TextField from '@material-ui/core/TextField';

const InputComponent = (props: any) => {
  let { inputRef, ...others } = props;
  return <div {...others} />;
};
const OutlinedDiv = ({
  children,
  label,
  error
}: {
  children: any;
  label: string;
  error: boolean;
}) => {
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
export default OutlinedDiv;
