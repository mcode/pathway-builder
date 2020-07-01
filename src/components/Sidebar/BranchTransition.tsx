import React, { FC, memo, useState, useCallback, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTools, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { TextField, Button } from '@material-ui/core';

import DropDown from 'components/elements/DropDown';
import { SidebarHeader, SidebarButton, OutlinedDiv } from '.';
import { Pathway, Transition } from 'pathways-model';
import { useCriteriaContext } from 'components/CriteriaProvider';
import {
  setTransitionCondition,
  setTransitionConditionDescription,
  removeTransitionCondition
} from 'utils/builder';
import { usePathwayContext } from 'components/PathwayProvider';
import useStyles from './styles';

interface BranchTransitionProps {
  pathway: Pathway;
  currentNodeKey: string;
  transition: Transition;
}

const BranchTransition: FC<BranchTransitionProps> = ({ pathway, currentNodeKey, transition }) => {
  const { updatePathway } = usePathwayContext();
  const { criteria } = useCriteriaContext();
  const criteriaOptions = criteria.map(c => ({ value: c.id, label: c.label }));
  const styles = useStyles();
  const transitionKey = transition?.transition || '';
  const transitionNode = pathway.states[transitionKey];
  const [useCriteriaSelected, setUseCriteriaSelected] = useState<boolean>(false);
  const criteriaDescription = transition.condition?.description;
  const criteriaIsValid = criteriaDescription != null;
  const criteriaDisplayIsValid = criteriaDescription && criteriaDescription !== '';

  const buttonText =
    transition.condition?.cql || transition.condition?.description ? 'DELETE' : 'CANCEL';
  const icon =
    transition.condition?.cql || transition.condition?.description ? (
      <FontAwesomeIcon icon={faTrashAlt} />
    ) : null;

  const handleUseCriteria = useCallback((): void => {
    if (transition.condition?.cql || transition.condition?.description) {
      // delete the the transition
      if (!currentNodeKey || !transition.id) return;
      updatePathway(removeTransitionCondition(pathway, currentNodeKey, transition.id));
      setUseCriteriaSelected(false);
    } else {
      setUseCriteriaSelected(!useCriteriaSelected);
    }
  }, [
    useCriteriaSelected,
    currentNodeKey,
    pathway,
    transition.condition,
    transition.id,
    updatePathway
  ]);

  const selectCriteriaSource = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeKey || !transition.id) return;

      const criteriaSource = event?.target.value || '';
      let elm = undefined;
      criteria.forEach(c => {
        if (c.id === criteriaSource) {
          elm = c.elm;
        }
      });
      if (!elm) return;
      updatePathway(
        setTransitionCondition(
          pathway,
          currentNodeKey,
          transition.id,
          transition.condition?.description || '',
          elm,
          criteriaSource
        )
      );
    },
    [currentNodeKey, transition.id, updatePathway, pathway, transition.condition, criteria]
  );

  const setCriteriaDisplay = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeKey || !transition.id) return;

      const criteriaDisplay = event?.target.value || '';
      updatePathway(
        setTransitionConditionDescription(pathway, currentNodeKey, transition.id, criteriaDisplay)
      );
    },
    [currentNodeKey, transition.id, updatePathway, pathway]
  );

  return (
    <>
      <hr className={styles.divider} />

      <SidebarHeader pathway={pathway} currentNode={transitionNode} isTransition={true} />

      {!(useCriteriaSelected || transition.condition?.cql) && (
        <SidebarButton
          buttonName="Use Criteria"
          buttonIcon={<FontAwesomeIcon icon={faPlus} />}
          buttonText="Add previously built or imported criteria logic to branch node."
          onClick={handleUseCriteria}
        />
      )}

      {(useCriteriaSelected || transition.condition?.cql) && (
        <OutlinedDiv label="Criteria Selector" error={!criteriaIsValid || !criteriaDisplayIsValid}>
          <>
            <DropDown
              id="Criteria"
              label="Criteria"
              options={criteriaOptions}
              onChange={selectCriteriaSource}
              value={transition.condition?.cql || undefined}
            />

            <TextField
              label="Criteria Display"
              value={transition.condition?.description || ''}
              variant="outlined"
              onChange={setCriteriaDisplay}
              error={!criteriaDisplayIsValid}
            />
          </>

          <Button
            className={styles.cancelButton}
            color="inherit"
            size="small"
            variant="outlined"
            startIcon={icon}
            onClick={handleUseCriteria}
          >
            {buttonText}
          </Button>
        </OutlinedDiv>
      )}

      {!(useCriteriaSelected || transition.condition?.cql) && (
        <SidebarButton
          buttonName="Build Criteria"
          buttonIcon={<FontAwesomeIcon icon={faTools} />}
          buttonText="Create new criteria logic to add to branch node."
        />
      )}
    </>
  );
};
export default memo(BranchTransition);
