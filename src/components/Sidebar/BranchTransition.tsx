import React, {
  FC,
  memo,
  useState,
  useCallback,
  ChangeEvent,
  useEffect,
  useMemo,
  useRef
} from 'react';
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
import { Transition } from 'pathways-model';
import { useCriteriaContext } from 'components/CriteriaProvider';
import { usePathwayContext } from 'components/PathwayProvider';
import useStyles from './styles';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';
import { useCurrentNodeContext } from 'components/CurrentNodeProvider';
import { useBuildCriteriaContext } from 'components/BuildCriteriaProvider';

interface BranchTransitionProps {
  transition: Transition;
}

const BranchTransition: FC<BranchTransitionProps> = ({ transition }) => {
  const { updatePathway } = usePathwayContext();
  const { criteria } = useCriteriaContext();
  const { buildCriteriaNodeId, updateBuildCriteriaNodeId } = useBuildCriteriaContext();
  const { pathway, pathwayRef } = useCurrentPathwayContext();
  const { currentNodeRef } = useCurrentNodeContext();
  const criteriaOptions = useMemo(() => criteria.map(c => ({ value: c.id, label: c.label })), [
    criteria
  ]);
  const styles = useStyles();
  const transitionKey = transition?.transition || '';
  const transitionNode = pathway?.nodes[transitionKey];
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
  const transitionRef = useRef(transition);

  const handleUseCriteria = useCallback((): void => {
    if (hasCriteria && transition.id && currentNodeRef.current?.key && pathwayRef.current) {
      // delete the transition criteria
      updatePathway(
        removeTransitionCondition(pathwayRef.current, currentNodeRef.current.key, transition.id)
      );
      setUseCriteriaSelected(false);
    } else {
      setUseCriteriaSelected(!useCriteriaSelected);
    }
  }, [useCriteriaSelected, currentNodeRef, pathwayRef, hasCriteria, transition.id, updatePathway]);

  const selectCriteriaSource = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeRef.current?.key || !transitionRef.current.id || !pathwayRef.current) return;

      const criteriaSource = event?.target.value || '';
      let elm = undefined;
      criteria.forEach(c => {
        if (c.id === criteriaSource) {
          elm = c.elm;
        }
      });
      if (!elm) return;
      const newPathway = setTransitionCondition(
        pathwayRef.current,
        currentNodeRef.current.key,
        transitionRef.current.id,
        transitionRef.current.condition?.description || '',
        elm,
        criteriaSource
      );

      updatePathway(newPathway);
    },
    [currentNodeRef, updatePathway, pathwayRef, transitionRef, criteria]
  );

  const setCriteriaDisplay = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeRef.current?.key || !transition.id || !pathwayRef.current) return;

      const criteriaDisplay = event?.target.value || '';
      updatePathway(
        setTransitionConditionDescription(
          pathwayRef.current,
          currentNodeRef.current.key,
          transition.id,
          criteriaDisplay
        )
      );
    },
    [currentNodeRef, transition.id, updatePathway, pathwayRef]
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

      {transitionNode && <SidebarHeader node={transitionNode} isTransition={true} />}

      {!displayCriteria && !buildCriteriaSelected && (
        <SidebarButton
          buttonName="Use Criteria"
          buttonIcon={faPlus}
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
          buttonIcon={faTools}
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
