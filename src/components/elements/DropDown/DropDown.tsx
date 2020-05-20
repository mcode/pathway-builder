import React, { FC, memo, useCallback, ChangeEvent } from 'react';
import { InputLabel, FormControl, Select, MenuItem } from '@material-ui/core';

interface Option {
  label: string;
  value: string;
}

interface DropDownProps {
  id: string;
  label: string;
  options: Array<Option>;
  value?: string;
  onChange: Function | null;
}

const DropDown: FC<DropDownProps> = ({ id, label, options, value, onChange }: DropDownProps) => {
  const handleSetSelected = useCallback(
    (event: ChangeEvent<{ value: unknown }>): void => {
      if (onChange) onChange(event);
    },
    [onChange]
  );

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel id={id} htmlFor={`${id}-select`}>
        {label}
      </InputLabel>

      <Select
        id={`${id}-select`}
        value={value || ''}
        onChange={handleSetSelected}
        label={label}
        error={value == null || value === ''}
        MenuProps={{
          getContentAnchorEl: null,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center'
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'center'
          }
        }}
        displayEmpty
      >
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default memo(DropDown);
