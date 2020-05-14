import React, { FC, useState, ChangeEvent, MouseEvent, memo } from 'react';
import OtherCriteria from './OtherCriteria';
import ChoiceNode from './ChoiceNode';
import AddChoiceButton from './AddChoiceButton';
import McodeCriteria from './McodeCriteria';
import { State, Pathway } from 'pathways-model';
import styles from './Sidebar.module.scss';
import { Select, MenuItem, FormControl, makeStyles, InputLabel } from '@material-ui/core';

interface BranchNodeProps {
  pathway: Pathway;
  currentNode: State;
  addChoiceNode: (event: MouseEvent<HTMLButtonElement>) => void;
}

const AddBranchNode: FC<BranchNodeProps> = ({ pathway, currentNode, addChoiceNode }) => {
  // TODO: in PATHWAYS-256 use the properties in the pathway instead?
  const [source, setSource] = useState<string>('');
  const [critera, setCritera] = useState<string>('');

  const handleSourceChange = (event: ChangeEvent<{ value: unknown }>): void => {
    // TODO: in PATHWAYS-256 set the source
    setSource(event.target.value as string);
    setCritera('');
  };

  const handleCriteraChange = (event: ChangeEvent<{ value: unknown }>): void => {
    // TODO: in PATHWAYS-256 set the criteria
    setCritera(event.target.value as string);
  };

  const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1, 0),
      minWidth: 120
    }
  }));

  const classes = useStyles();

  let displayCritera = null;
  if (source === 'mCode') {
    displayCritera = <McodeCriteria critera={critera} handleCriteraChange={handleCriteraChange} />;
  } else if (source === 'other') {
    displayCritera = <OtherCriteria critera={critera} handleCriteraChange={handleCriteraChange} />;
  } else {
    displayCritera = null;
  }

  return (
    <div className={styles.addNodesContainer}>
      <FormControl variant="outlined" className={classes.formControl} fullWidth>
        <InputLabel>Criteria Source</InputLabel>
        <Select
          value={source}
          onChange={handleSourceChange}
          displayEmpty
          label="Criteria Source"
          error={source === ''}
        >
          <MenuItem value={'mCode'}>mCODE</MenuItem>
          <MenuItem value={'other'}>Other Library</MenuItem>
        </Select>
      </FormControl>
      {displayCritera}
      <hr />
      {currentNode.transitions.map((transition, index) => (
        <ChoiceNode pathway={pathway} key={index} transition={transition.transition} />
      ))}
      {critera !== '' ? <AddChoiceButton addChoiceNode={addChoiceNode} /> : null}
    </div>
  );
};

export default memo(AddBranchNode);
