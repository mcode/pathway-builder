import React, { FC, memo, useState, useCallback, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTools } from '@fortawesome/free-solid-svg-icons';
import DropDown from 'components/elements/DropDown';
import { TextField, FormControl } from '@material-ui/core';
import {
  setStateCriteriaSource,
  setStateMcodeCriteria,
  setStateOtherCriteria,
  addTransition,
  createState,
  addState,
  setTransitionCriteria,
  setTransitionCriteriaDisplay
} from 'utils/builder';
import { SidebarHeader, SidebarButton } from '.';
import { Pathway, Transition, BranchState } from 'pathways-model';
import useStyles from './styles';

interface BranchTransitionProps {
  pathway: Pathway;
  transition: Transition;
  currentNode: BranchState;
  updatePathway: (pathway: Pathway) => void;
}

const criteriaOptions = [
  { value: 'TumorSize2+', label: 'Tumor Size > 2cm' },
  { value: 'TumorSize2-', label: 'Tumor Size <= 2cm' },
  { value: 'Other', label: 'Other' }
];

const BranchTransition: FC<BranchTransitionProps> = ({
  pathway,
  transition,
  currentNode,
  updatePathway
}) => {
  const styles = useStyles();
  const transitionKey = transition?.transition || '';
  const transitionNode = pathway.states[transitionKey];
  const [useSelected, setUseSelected] = useState<boolean>(false);
  const currentNodeKey = currentNode?.key;

  const handleUseCriteria = useCallback((): void => {
    setUseSelected(!useSelected);
  }, [pathway, updatePathway]);

  const selectCriteriaSource = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeKey || !transition.id) return;

      const criteriaSource = event?.target.value || '';
      updatePathway(setTransitionCriteria(pathway, criteriaSource, transitionKey, currentNodeKey));
    },
    [currentNodeKey, updatePathway, pathway]
  );

  const setCriteriaDisplay = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeKey || !transition.id) return;

      const criteriaSource = event?.target.value || '';
      updatePathway(
        setTransitionCriteriaDisplay(pathway, criteriaSource, transitionKey, currentNodeKey)
      );
    },
    [currentNodeKey, updatePathway, pathway]
  );

  return (
    <>
      <hr className={styles.divider} />

      <SidebarHeader
        pathway={pathway}
        currentNode={transitionNode}
        updatePathway={updatePathway}
        isTransition={true}
      />
      {useSelected === false && (
        <SidebarButton
          buttonName="Use Criteria"
          buttonIcon={<FontAwesomeIcon icon={faPlus} />}
          buttonText="Add previously built or imported criteria logic to branch node."
          onClick={handleUseCriteria}
        />
      )}

      {useSelected === true && (
        <>
          <DropDown
            id="Criteria"
            label="Criteria"
            options={criteriaOptions}
            onChange={selectCriteriaSource}
            value={transition.criteria}
          />
          <FormControl variant="outlined" fullWidth>
            <TextField
              label="Criteria display"
              value={transition.criteriaDisplay || ''}
              variant="outlined"
              onChange={setCriteriaDisplay}
              error={transition.criteriaDisplay === undefined || transition.criteriaDisplay === ''}
            />
          </FormControl>
        </>
      )}

      <SidebarButton
        buttonName="Build Criteria"
        buttonIcon={<FontAwesomeIcon icon={faTools} />}
        buttonText="Create new criteria logic to add to branch node."
      />
    </>
  );
};

export default memo(BranchTransition);
