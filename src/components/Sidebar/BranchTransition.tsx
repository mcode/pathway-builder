import React, { FC, memo, useState, useCallback, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSave, faTools, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import DropDown from 'components/elements/DropDown';
import { Button, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import {
  removeTransitionCondition,
  setTransitionCondition,
  setTransitionConditionDescription
} from 'utils/builder';
import { OutlinedDiv, SidebarHeader, SidebarButton } from '.';
import { Pathway, Transition } from 'pathways-model';
import { useCriteriaContext } from 'components/CriteriaProvider';
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
  const hasCriteria = transition.condition?.cql || transition.condition?.description;
  const buttonText = hasCriteria ? 'DELETE' : 'CANCEL';
  const icon = hasCriteria ? <FontAwesomeIcon icon={faTrashAlt} /> : null;
  const displayCriteria =
    useCriteriaSelected || transition.condition?.cql || transition.condition?.description;
  const [buildCriteriaSelected, setBuildCriteriaSelected] = useState<boolean>(false);
  const [criteriaName, setCriteriaName] = useState<string>('');

  const handleUseCriteria = useCallback((): void => {
    if (hasCriteria && transition.id) {
      // delete the transition criteria
      updatePathway(removeTransitionCondition(pathway, currentNodeKey, transition.id));
      setUseCriteriaSelected(false);
    } else {
      setUseCriteriaSelected(!useCriteriaSelected);
    }
  }, [useCriteriaSelected, currentNodeKey, pathway, hasCriteria, transition.id, updatePathway]);

  const handleBuildCriteria = useCallback((): void => {
    setBuildCriteriaSelected(!buildCriteriaSelected);
  }, [buildCriteriaSelected]);

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

  const handleCriteriaName = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      setCriteriaName(event?.target.value || '');
    },
    [setCriteriaName]
  );

  return (
    <>
      <hr className={styles.divider} />

      <SidebarHeader pathway={pathway} currentNode={transitionNode} isTransition={true} />

      {!displayCriteria && !buildCriteriaSelected && (
        <SidebarButton
          buttonName="Use Criteria"
          buttonIcon={<FontAwesomeIcon icon={faPlus} />}
          buttonText="Add previously built or imported criteria logic to branch node."
          onClick={handleUseCriteria}
        />
      )}

      {displayCriteria && (
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

      {!displayCriteria && !buildCriteriaSelected && (
        <SidebarButton
          buttonName="Build Criteria"
          buttonIcon={<FontAwesomeIcon icon={faTools} />}
          buttonText="Create new criteria logic to add to branch node."
          onClick={handleBuildCriteria}
        />
      )}

      {buildCriteriaSelected && (
        <OutlinedDiv label="Criteria Builder" error={criteriaName === ''}>
          <TextField
            error={criteriaName === ''}
            label="Criteria Name"
            variant="outlined"
            onChange={handleCriteriaName}
          />
          <div>
            <FormControlLabel
              label="Add to reusable criteria"
              control={<Checkbox color="default" />}
            />
            <Button color="inherit" size="large" variant="outlined">
              Cancel
            </Button>
            <Button
              className={styles.saveButton}
              color="inherit"
              size="large"
              variant="outlined"
              startIcon={<FontAwesomeIcon icon={faSave} />}
              disabled
            >
              Save
            </Button>
          </div>
        </OutlinedDiv>
      )}
    </>
  );
};

export default memo(BranchTransition);
