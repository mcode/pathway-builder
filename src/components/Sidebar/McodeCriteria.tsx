import React, { FC, ChangeEvent, ReactNode } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';

interface CriteraProps {
  critera: string;
  handleCriteraChange: (
    event: ChangeEvent<{ name?: string | undefined; value: unknown }>,
    child: ReactNode
  ) => void;
  classes: any;
}

const McodeCriteria: FC<CriteraProps> = ({ critera, handleCriteraChange, classes }) => {
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
