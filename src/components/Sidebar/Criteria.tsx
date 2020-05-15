import React, { FC, ChangeEvent, memo } from 'react';
import { Select, MenuItem, FormControl, makeStyles, InputLabel } from '@material-ui/core';

interface CriteraProps {
  critera: string;
  handleCriteraChange: (event: ChangeEvent<{ value: unknown }>) => void;
  menuItems : Array<string>;
}

const Criteria: FC<CriteraProps> = ({ critera, handleCriteraChange, menuItems }) => {
  const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1, 0),
      minWidth: 120
    }
  }));

  const classes = useStyles();

  return (
    <FormControl variant="outlined" className={classes.formControl} fullWidth>
      <InputLabel>Criteria</InputLabel>
      <Select
        value={critera}
        onChange={handleCriteraChange}
        displayEmpty
        label="Criteria"
        error={critera === ''}
      >
        {menuItems.map(item =>
          <MenuItem value={item}>{item}</MenuItem>)}
      </Select>
    </FormControl>
  );
};

export default memo(Criteria);
