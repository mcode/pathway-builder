import React, { FC, useState } from "react";
import styles from "./DropDown.module.scss";

import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

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

const DropDown: FC<Props> = ({
  id,
  label,
  options,
  initialSelected,
}: Props) => {
  const [selected, _setSelected] = useState<Option>(
    initialSelected ?? options[0]
  );

  const setSelected = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedOption = options.find(
      (opt) => opt.value === (event.target.value as string)
    );
    if (selectedOption) _setSelected(selectedOption);
  };

  return (
    <FormControl variant="outlined" className={styles.dropdown}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Select
        native
        value={selected.value}
        onChange={setSelected}
        label={label}
        inputProps={{
          id: id,
        }}
      >
        {options.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </Select>
    </FormControl>
  );
};

export default DropDown;
