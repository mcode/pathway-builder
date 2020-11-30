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
import { OutlinedDiv, SidebarButton } from 'components/Sidebar';
import { PathwayNode, Transition } from 'pathways-model';
import { useCriteriaContext } from 'components/StaticApp/CriteriaProvider';
import useStyles from 'components/Sidebar/styles';
import { useCurrentPathwayContext } from 'components/StaticApp/CurrentPathwayProvider';
import { useCurrentCriteriaContext } from 'components/CurrentCriteriaProvider';
import { useCriteriaBuilderContext } from 'components/CriteriaBuilderProvider';
import { Criteria, CriteriaExecutionModel } from 'criteria-model';
import useCurrentNodeStatic from 'hooks/useCurrentNodeStatic';

interface BranchTransitionProps {
  transition: Transition;
  currentNode: PathwayNode | null;
}

const BranchTransition: FC<BranchTransitionProps> = ({ transition, currentNode }) => {
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
  const { pathwayRef, setCurrentPathway } = useCurrentPathwayContext();
  const currentNodeStatic = useCurrentNodeStatic(pathwayRef.current);
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
  let builderElements: CriteriaExecutionModel | null = null;
  let builderCriteria: Criteria | undefined;
  if (transition.condition) {
    builderCriteria = criteria.find(c => c.id === transition.condition?.criteriaSource);
    if (builderCriteria?.builder)
      builderElements = {
        builder: builderCriteria.builder,
        cql: builderCriteria.cql,
        elm: builderCriteria.elm
      };
  }
  const dislayEditCriteria = !transitionSelected && builderElements;

  const handleUseCriteria = useCallback((): void => {
    if (hasCriteria && currentNodeStatic && pathwayRef.current) {
      // delete the transition criteria
      setCurrentPathway(
        removeTransitionCondition(pathwayRef.current, currentNodeStatic.key, transition.id)
      );
      setUseCriteriaSelected(false);
    } else {
      setUseCriteriaSelected(!useCriteriaSelected);
    }
  }, [
    useCriteriaSelected,
    currentNodeStatic,
    pathwayRef,
    hasCriteria,
    transition.id,
    setCurrentPathway
  ]);

  const selectCriteriaSource = useCallback(
    (criteriaId: string): void => {
      if (!currentNodeStatic || !pathwayRef.current) return;

      const selectedCriteria = criteria.find(c => c.id === criteriaId);
      if (!selectedCriteria) return;
      const newPathway = setTransitionCondition(
        pathwayRef.current,
        currentNodeStatic.key,
        transitionRef.current.id,
        transitionRef.current.condition?.description || selectedCriteria.display,
        selectedCriteria
      );

      setCurrentPathway(newPathway);
    },
    [currentNodeStatic, setCurrentPathway, pathwayRef, transitionRef, criteria]
  );

  const setCriteriaDisplay = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeStatic || !pathwayRef.current) return;

      const criteriaDisplay = event?.target.value || '';
      setCurrentPathway(
        setTransitionConditionDescription(
          pathwayRef.current,
          currentNodeStatic.key,
          transition.id,
          criteriaDisplay
        )
      );
    },
    [currentNodeStatic, transition.id, setCurrentPathway, pathwayRef]
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
    setCurrentCriteria(builderElements);
    if (builderCriteria?.label) setCriteriaName(builderCriteria?.label);
    if (!buildCriteriaSelected) setBuildCriteriaSelected(true);
    if (builderElements) setCriteriaBuilder(builderElements);
  }, [
    buildCriteriaSelected,
    builderCriteria,
    builderElements,
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
    if (!currentNodeStatic || !pathwayRef.current || !currentCriteria?.cql) return;

    const criteria = addBuilderCriteria(
      currentCriteria,
      criteriaName,
      transition.condition?.criteriaSource
    );
    const newPathway = setTransitionCondition(
      pathwayRef.current,
      currentNodeStatic.key,
      transitionRef.current.id,
      criteriaName,
      criteria[0]
    );

    setCurrentPathway(newPathway);
    handleBuildCriteriaCancel();
  }, [
    currentNodeStatic,
    setCurrentPathway,
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
              className={styles.criteriaText}
              value={transition.condition?.description || ''}
              variant="outlined"
              onChange={setCriteriaDisplay}
              error={!criteriaDisplayIsValid}
              helperText='Use commas "," to separate into multiple lines (up to 3)'
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
            value={builderCriteria?.label}
            fullWidth
            disabled
          />
          <span className={styles.buildCriteriaText}>{builderElements?.builder?.text}</span>
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
          {currentCriteria?.builder?.text && (
            <span className={styles.buildCriteriaText}>{currentCriteria.builder.text}</span>
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
