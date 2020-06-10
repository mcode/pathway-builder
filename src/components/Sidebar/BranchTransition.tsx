import React, { FC, memo, useState, useCallback, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTools } from '@fortawesome/free-solid-svg-icons';
import DropDown from 'components/elements/DropDown';
import { TextField, FormControl } from '@material-ui/core';
import { setTransitionCriteria, setTransitionCriteriaDisplay } from 'utils/builder';
import { SidebarHeader, SidebarButton } from '.';
import { Pathway, Transition } from 'pathways-model';
import { useCriteriaContext } from 'components/CriteriaProvider';
import useStyles from './styles';

interface BranchTransitionProps {
  pathway: Pathway;
  currentNodeKey: string;
  transition: Transition;
  updatePathway: (pathway: Pathway) => void;
}

const BranchTransition: FC<BranchTransitionProps> = ({
  pathway,
  currentNodeKey,
  transition,
  updatePathway
}) => {
  const { criteria } = useCriteriaContext();
  const criteriaOptions = criteria.map(c => ({ value: c.label, label: c.label }));
  const styles = useStyles();
  const transitionKey = transition?.transition || '';
  const transitionNode = pathway.states[transitionKey];
  const [useCriteriaSelected, setUseCriteriaSelected] = useState<boolean>(false);

  const handleUseCriteria = useCallback((): void => {
    setUseCriteriaSelected(!useCriteriaSelected);
  }, [useCriteriaSelected]);

  const selectCriteriaSource = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeKey || !transition.id) return;

      const criteriaSource = event?.target.value || '';
      updatePathway(setTransitionCriteria(pathway, criteriaSource, transitionKey, currentNodeKey));
    },
    [currentNodeKey, transitionKey, transition.id, updatePathway, pathway]
  );

  const setCriteriaDisplay = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeKey || !transition.id) return;

      const criteriaSource = event?.target.value || '';
      updatePathway(
        setTransitionCriteriaDisplay(pathway, criteriaSource, transitionKey, currentNodeKey)
      );
    },
    [currentNodeKey, transitionKey, transition.id, updatePathway, pathway]
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
      {!useCriteriaSelected && (
        <SidebarButton
          buttonName="Use Criteria"
          buttonIcon={<FontAwesomeIcon icon={faPlus} />}
          buttonText="Add previously built or imported criteria logic to branch node."
          onClick={handleUseCriteria}
        />
      )}

      {useCriteriaSelected && (
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
