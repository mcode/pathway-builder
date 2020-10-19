import React, { FC, memo, useCallback, ChangeEvent, ReactElement } from 'react';
import { InputLabel, FormControl, TextField, Select, MenuItem } from '@material-ui/core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Autocomplete } from '@material-ui/lab';

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
  autocomplete?: boolean;
}

const DropDown: FC<DropDownProps> = ({
  id,
  label,
  options,
  value,
  onChange,
  autocomplete = true
}: DropDownProps) => {
  const handleSetSelected = useCallback(
    (event: ChangeEvent<{ value: unknown }>): void => {
      if (onChange) onChange(event.target.value || '');
    },
    [onChange]
  );

  const handleAutoSelected = useCallback(
    (event: ChangeEvent<{}>, value: Option): void => {
      if (onChange) onChange(value.value);
    },
    [onChange]
  );

  const getValue = (value: string | undefined): Option | undefined => {
    return (
      options.find(option => {
        return option.value === value;
      }) || options[0]
    );
  };

  const renderAuto = (): ReactElement => {
    return (
      <Autocomplete
        disableClearable
        fullWidth
        onChange={handleAutoSelected}
        value={getValue(value)}
        popupIcon={<FontAwesomeIcon icon={faCaretDown} style={{ color: 'white' }} />}
        options={options}
        getOptionLabel={(option): string => option.label}
        renderOption={(option: Option): ReactElement => (
          <div key={option.value} style={{ color: 'black' }}>
            {option.label}
          </div>
        )}
        renderInput={(params): ReactElement => (
          <TextField {...params} variant="outlined" label={label} />
        )}
      />
    );
  };

  const renderManual = (): ReactElement => {
    return (
      <>
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
      </>
    );
  };

  return (
    <FormControl variant="outlined" fullWidth>
      {autocomplete ? renderAuto() : renderManual()}
    </FormControl>
  );
};

export default memo(DropDown);
