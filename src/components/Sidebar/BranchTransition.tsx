import React, { FC, memo, useState, useCallback, ChangeEvent, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSave, faTools, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import DropDown from 'components/elements/DropDown';
import { Button, Checkbox, FormControlLabel, TextField, Box } from '@material-ui/core';
import {
  removeTransitionCondition,
  setTransitionCondition,
  setTransitionConditionDescription
} from 'utils/builder';
import { OutlinedDiv, SidebarHeader, SidebarButton } from '.';
import { Pathway, Transition } from 'pathways-model';
import { usePreconditionContext } from 'components/PreconditionProvider';
import { usePathwayContext } from 'components/PathwayProvider';
import useStyles from './styles';

interface BranchTransitionProps {
  pathway: Pathway;
  currentNodeKey: string;
  transition: Transition;
}

const BranchTransition: FC<BranchTransitionProps> = ({ pathway, currentNodeKey, transition }) => {
  const { updatePathway } = usePathwayContext();
  const { criteria, buildCriteriaNodeId, updateBuildCriteriaNodeId } = useCriteriaContext();
  const criteriaOptions = criteria.map(c => ({ value: c.id, label: c.label }));
  const styles = useStyles();
  const transitionKey = transition?.transition || '';
  const transitionNode = pathway.nodes[transitionKey];
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

  const selectPreconditionSource = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeKey || !transition.id) return;

      const preconditionSource = event?.target.value || '';
      let elm = undefined;
      precondition.forEach(c => {
        if (c.id === preconditionSource) {
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
          preconditionSource
        )
      );
    },
    [currentNodeKey, transition.id, updatePathway, pathway, transition.condition, precondition]
  );

  const setPreconditionDisplay = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeKey || !transition.id) return;

      const preconditionDisplay = event?.target.value || '';
      updatePathway(
        setTransitionConditionDescription(
          pathway,
          currentNodeKey,
          transition.id,
          preconditionDisplay
        )
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

  const handleBuildCriteria = useCallback((): void => {
    updateBuildCriteriaNodeId(transition.id ?? '');
    setBuildCriteriaSelected(!buildCriteriaSelected);
  }, [buildCriteriaSelected, updateBuildCriteriaNodeId, transition]);

  const handleBuildCriteriaCancel = useCallback((): void => {
    if (buildCriteriaNodeId === transition.id) updateBuildCriteriaNodeId('');
    setBuildCriteriaSelected(false);
    setCriteriaName('');
  }, [updateBuildCriteriaNodeId, setCriteriaName, buildCriteriaNodeId, transition]);

  // Cancel current build criteria if clicked on another BranchTransition
  useEffect(() => {
    if (buildCriteriaNodeId !== '' && buildCriteriaNodeId !== transition.id) {
      handleBuildCriteriaCancel();
    }
  }, [buildCriteriaNodeId, handleBuildCriteriaCancel, transition]);

  return (
    <>
      <hr className={styles.divider} />

      <SidebarHeader pathway={pathway} currentNode={transitionNode} isTransition={true} />

      {!displayCriteria && !buildCriteriaSelected && (
        <SidebarButton
          buttonName="Use Precondition"
          buttonIcon={<FontAwesomeIcon icon={faPlus} />}
          buttonText="Add previously built or imported precondition logic to branch node."
          onClick={handleUsePrecondition}
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
        <OutlinedDiv label="Criteria Builder" error={true}>
          <TextField
            error={criteriaName === ''}
            label="Criteria Name"
            variant="outlined"
            onChange={handleCriteriaName}
            fullWidth
          />
          <div className={styles.buildCriteriaContainer}>
            <FormControlLabel
              label={<Box fontStyle="italic">Add to reusable criteria</Box>}
              control={<Checkbox color="default" />}
            />
            <Button
              color="inherit"
              size="large"
              variant="outlined"
              onClick={handleBuildCriteriaCancel}
            >
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
