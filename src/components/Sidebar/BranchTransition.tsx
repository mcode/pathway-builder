import React, { FC, memo, useState, useCallback, ChangeEvent, useMemo, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTools, faTrashAlt, faThList, faEdit } from '@fortawesome/free-solid-svg-icons';
import DropDown from 'components/elements/DropDown';
import { Button, Checkbox, FormControlLabel, TextField, Box } from '@material-ui/core';
import {
  removeTransitionCondition,
  setTransitionCondition,
  setTransitionConditionDescription
} from 'utils/builder';
import { OutlinedDiv, SidebarButton } from '.';
import { Transition } from 'pathways-model';
import { useCriteriaContext } from 'components/CriteriaProvider';
import { usePathwaysContext } from 'components/PathwaysProvider';
import useStyles from './styles';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';
import { useCurrentNodeContext } from 'components/CurrentNodeProvider';
import { useCurrentCriteriaContext } from 'components/CurrentCriteriaProvider';
import { useCriteriaBuilderContext } from 'components/CriteriaBuilderProvider';
import { BuilderModel } from 'criteria-model';

interface BranchTransitionProps {
  transition: Transition;
}

const BranchTransition: FC<BranchTransitionProps> = ({ transition }) => {
  const { updatePathway } = usePathwaysContext();
  const { criteria, addBuilderCriteria } = useCriteriaContext();
  const {
    buildCriteriaSelected,
    setBuildCriteriaSelected,
    currentCriteriaNodeId,
    setCurrentCriteriaNodeId,
    currentCriteria,
    setCurrentCriteria,
    criteriaName,
    setCriteriaName,
    resetCurrentCriteria
  } = useCurrentCriteriaContext();
  const { resetCriteriaBuilder, setCriteriaBuilder } = useCriteriaBuilderContext();
  const { pathwayRef } = useCurrentPathwayContext();
  const { currentNodeRef } = useCurrentNodeContext();
  const criteriaOptions = useMemo(() => criteria.map(c => ({ value: c.id, label: c.label })), [
    criteria
  ]);
  const criteriaAvailable = criteriaOptions.length > 0;
  const styles = useStyles();
  const [useCriteriaSelected, setUseCriteriaSelected] = useState<boolean>(false);
  const criteriaDescription = transition.condition?.description;
  const criteriaIsValid = criteriaDescription != null;
  const criteriaDisplayIsValid = criteriaDescription && criteriaDescription !== '';
  const hasCriteria = transition.condition?.cql || transition.condition?.description;
  const buttonText = hasCriteria ? 'DELETE' : 'CANCEL';
  const icon = hasCriteria ? <FontAwesomeIcon icon={faTrashAlt} /> : null;
  const displayCriteria =
    criteriaAvailable &&
    (useCriteriaSelected || transition.condition?.cql || transition.condition?.description);
  const transitionRef = useRef(transition);
  const transitionSelected = buildCriteriaSelected && currentCriteriaNodeId === transition.id;
  // Check if criteria was built by criteria builder
  let builderCriteria: BuilderModel | null = null;
  if (transition.condition) {
    const crit = criteria.find(c => c.id === transition.condition?.criteriaSource);
    if (crit?.builder) builderCriteria = crit.builder;
  }
  const dislayEditCriteria = !transitionSelected && builderCriteria;

  const handleUseCriteria = useCallback((): void => {
    if (hasCriteria && currentNodeRef.current && pathwayRef.current) {
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
      if (!currentNodeRef.current || !pathwayRef.current) return;

      const criteriaId = event?.target.value || '';
      const selectedCriteria = criteria.find(c => c.id === criteriaId);
      if (!selectedCriteria) return;
      const newPathway = setTransitionCondition(
        pathwayRef.current,
        currentNodeRef.current.key,
        transitionRef.current.id,
        transitionRef.current.condition?.description || '',
        selectedCriteria
      );

      updatePathway(newPathway);
    },
    [currentNodeRef, updatePathway, pathwayRef, transitionRef, criteria]
  );

  const setCriteriaDisplay = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeRef.current || !pathwayRef.current) return;

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
    setCurrentCriteriaNodeId(transition.id);
    setCurrentCriteria(null);
    setCriteriaName('');
    if (!buildCriteriaSelected) setBuildCriteriaSelected(true);
    resetCriteriaBuilder();
  }, [
    buildCriteriaSelected,
    setCurrentCriteriaNodeId,
    transition,
    setBuildCriteriaSelected,
    setCurrentCriteria,
    resetCriteriaBuilder,
    setCriteriaName
  ]);

  const handleEditCriteria = useCallback((): void => {
    setCurrentCriteriaNodeId(transition.id);
    setCurrentCriteria(builderCriteria as BuilderModel);
    if (transition.condition?.description) setCriteriaName(transition.condition.description);
    if (!buildCriteriaSelected) setBuildCriteriaSelected(true);
    if (builderCriteria) setCriteriaBuilder(builderCriteria);
  }, [
    buildCriteriaSelected,
    builderCriteria,
    transition,
    setCurrentCriteriaNodeId,
    setCurrentCriteria,
    setCriteriaName,
    setBuildCriteriaSelected,
    setCriteriaBuilder
  ]);

  const handleBuildCriteriaCancel = useCallback((): void => {
    resetCurrentCriteria();
    resetCriteriaBuilder();
  }, [resetCurrentCriteria, resetCriteriaBuilder]);

  const handleBuildCriteriaSave = useCallback(() => {
    if (!currentNodeRef.current || !pathwayRef.current || !currentCriteria?.cql) return;

    const criteria = addBuilderCriteria(
      currentCriteria,
      criteriaName,
      transition.condition?.criteriaSource
    );
    const newPathway = setTransitionCondition(
      pathwayRef.current,
      currentNodeRef.current.key,
      transitionRef.current.id,
      criteriaName,
      criteria[0]
    );

    updatePathway(newPathway);
    handleBuildCriteriaCancel();
  }, [
    currentNodeRef,
    updatePathway,
    pathwayRef,
    transitionRef,
    currentCriteria,
    criteriaName,
    transition,
    handleBuildCriteriaCancel,
    addBuilderCriteria
  ]);

  return (
    <>
      {!displayCriteria && !transitionSelected && (
        <SidebarButton
          buttonName="Select Criteria"
          buttonIcon={faThList}
          buttonColor="secondary"
          buttonText="Add previously built or imported criteria logic to branch node."
          onClick={handleUseCriteria}
          disabled={!criteriaAvailable}
          hasTooltip={!criteriaAvailable}
          tooltipTitle="No criteria to select. Add criteria to use."
        />
      )}

      {displayCriteria && !transitionSelected && !dislayEditCriteria && (
        <OutlinedDiv label="Criteria Selector" error={!criteriaIsValid || !criteriaDisplayIsValid}>
          <>
            <DropDown
              id="Criteria"
              label="Criteria"
              options={criteriaOptions}
              onChange={selectCriteriaSource}
              value={transition.condition?.criteriaSource || undefined}
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

      {dislayEditCriteria && (
        <OutlinedDiv label="Criteria Builder" error={false}>
          <TextField
            label="Criteria Name"
            variant="outlined"
            value={transition.condition?.description}
            fullWidth
            disabled
          />
          <span className={styles.buildCriteriaText}>{builderCriteria?.text}</span>
          <div className={styles.buildCriteriaContainer}>
            <Button
              className={styles.cancelButton}
              color="inherit"
              size="small"
              variant="outlined"
              startIcon={icon}
              onClick={handleUseCriteria}
            >
              DELETE CRITERIA
            </Button>
            <Button
              className={styles.editButton}
              color="inherit"
              size="small"
              variant="outlined"
              startIcon={<FontAwesomeIcon icon={faEdit} />}
              onClick={handleEditCriteria}
            >
              EDIT CRITERIA
            </Button>
          </div>
        </OutlinedDiv>
      )}

      {!displayCriteria && !transitionSelected && (
        <SidebarButton
          buttonName="Build Criteria"
          buttonColor="secondary"
          buttonIcon={faTools}
          buttonText="Create new criteria logic to add to branch node."
          extraMargin
          onClick={handleBuildCriteria}
        />
      )}

      {transitionSelected && (
        <OutlinedDiv label="Criteria Builder" error={!criteriaIsValid || !criteriaDisplayIsValid}>
          <TextField
            error={criteriaName === ''}
            label="Criteria Name"
            variant="outlined"
            onChange={handleCriteriaName}
            value={criteriaName}
            fullWidth
          />
          {currentCriteria?.text && (
            <span className={styles.buildCriteriaText}>{currentCriteria.text}</span>
          )}
          <div className={styles.buildCriteriaContainer}>
            <FormControlLabel
              label={<Box fontStyle="italic">Add to reusable criteria</Box>}
              control={<Checkbox color="default" />}
              checked
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
              disabled={criteriaName === '' || currentCriteria === null}
              onClick={handleBuildCriteriaSave}
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
