import React, { FC, useState } from 'react';
import styles from './DropDown.module.scss';

import { InputLabel, FormControl, Select, MenuItem } from '@material-ui/core';

interface Option {
  label: string;
  value: string;
}

interface Props {
  id: string;
  label: string;
  options: Array<Option>;
  initialSelected?: Option;
}

const DropDown: FC<Props> = ({ id, label, options, initialSelected }: Props) => {
  const [selected, _setSelected] = useState<Option>(initialSelected ?? options[0]);

  const setSelected = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedOption = options.find(opt => opt.value === (event.target.value as string));
    if (selectedOption) _setSelected(selectedOption);
  };

  return (
    <FormControl variant="outlined" className={styles.dropdown}>
      <InputLabel id={id}>{label}</InputLabel>
      <Select id={id} value={selected.value} onChange={setSelected} label={label}>
        {options.map(option => (
          <MenuItem value={option.value}>{option.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DropDown;
