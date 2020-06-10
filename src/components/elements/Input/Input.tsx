import React, { FC, memo, useCallback, ChangeEvent } from 'react';
import { FormControl, TextField } from '@material-ui/core';

interface Option {
  label: string;
  value: string;
}

interface InputProps {
  id: string;
  label: string;
  value?: string;
  onChange: Function | null;
}

const Input: FC<InputProps> = ({ id, label, value, onChange }: InputProps) => {
  const handleChange = useCallback(
    (event: ChangeEvent<{ value: unknown }>): void => {
      if (onChange) onChange(event);
    },
    [onChange]
  );

  return (
    <FormControl variant="outlined" fullWidth>
      <TextField
        id={`${id}-input`}
        label={label}
        value={value || ''}
        onChange={handleChange}
        variant="outlined"
        error={value == null || value === ''}
      />
    </FormControl>
  );
};

export default memo(Input);
