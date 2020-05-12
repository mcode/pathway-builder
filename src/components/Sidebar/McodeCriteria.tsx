import React, { FC, ChangeEvent } from 'react';
import { Select, MenuItem, FormControl, makeStyles, InputLabel } from '@material-ui/core';

interface CriteraProps {
  critera: string;
  handleCriteraChange: (event: ChangeEvent<{ value: unknown }>) => void;
}

const McodeCriteria: FC<CriteraProps> = ({ critera, handleCriteraChange }) => {
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
        <MenuItem value={'tumor'}>Tumor Category</MenuItem>
        <MenuItem value={'node'}>Node Category</MenuItem>
        <MenuItem value={'metastatis'}>Metastatis Category</MenuItem>
      </Select>
    </FormControl>
  );
};

export default McodeCriteria;
