import React, { FC, memo, useState, useCallback, ChangeEvent } from 'react';
import { InputLabel, FormControl, Select, MenuItem } from '@material-ui/core';

interface Option {
  label: string;
  value: string;
}

interface DropDownProps {
  id: string;
  label: string;
  options: Array<Option>;
  initialSelected?: Option;
  onChange: Function | null;
}

const DropDown: FC<DropDownProps> = ({
  id,
  label,
  options,
  initialSelected,
  onChange
}: DropDownProps) => {
  const [selected, setSelected] = useState<Option>(initialSelected ?? { label: '', value: '' });

  const handleSetSelected = useCallback(
    (event: ChangeEvent<{ value: unknown }>): void => {
      const selectedOption = options.find(opt => opt.value === (event.target.value as string));
      if (selectedOption) setSelected(selectedOption);
      if (onChange) onChange(event);
    },
    [onChange, options]
  );

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel id={id} htmlFor={`${id}-select`}>
        {label}
      </InputLabel>

      <Select
        id={`${id}-select`}
        value={selected.value}
        onChange={handleSetSelected}
        label={label}
        error={selected.value === ''}
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
