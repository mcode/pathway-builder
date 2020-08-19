import React, { FC, memo, useState, useCallback, ChangeEvent, useMemo, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTools, faTrashAlt, faThList } from '@fortawesome/free-solid-svg-icons';
import DropDown from 'components/elements/DropDown';
import { Button, Checkbox, FormControlLabel, TextField, Box } from '@material-ui/core';
import shortid from 'shortid';
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
import { useBuildCriteriaContext } from 'components/BuildCriteriaProvider';
import { convertBasicCQL } from 'engine/cql-to-elm';
import { useCriteriaBuilderStateContext } from 'components/CriteriaBuilderStateProvider';

interface BranchTransitionProps {
  transition: Transition;
}

const BranchTransition: FC<BranchTransitionProps> = ({ transition }) => {
  const { updatePathway } = usePathwaysContext();
  const { criteria, addElmCriteria } = useCriteriaContext();
  const {
    buildCriteriaSelected,
    setBuildCriteriaSelected,
    buildCriteriaNodeId,
    setBuildCriteriaNodeId,
    buildCriteriaCql,
    setBuildCriteriaCql,
    criteriaName,
    setCriteriaName,
    resetBuildCriteria
  } = useBuildCriteriaContext();
  const { resetCriteriaBuilderState } = useCriteriaBuilderStateContext();
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
    setBuildCriteriaNodeId(transition.id ?? '');
    setBuildCriteriaCql(null);
    setCriteriaName('');
    if (!buildCriteriaSelected) setBuildCriteriaSelected(true);
    resetCriteriaBuilderState();
  }, [
    buildCriteriaSelected,
    setBuildCriteriaNodeId,
    transition,
    setBuildCriteriaSelected,
    setBuildCriteriaCql,
    resetCriteriaBuilderState,
    setCriteriaName
  ]);

  const handleBuildCriteriaCancel = useCallback((): void => {
    resetBuildCriteria();
    resetCriteriaBuilderState();
  }, [resetBuildCriteria, resetCriteriaBuilderState]);

  const handleBuildCriteriaSave = useCallback(async (): Promise<void> => {
    if (
      !currentNodeRef.current?.key ||
      !transitionRef.current.id ||
      !pathwayRef.current ||
      !buildCriteriaCql?.cql
    )
      return;

    // CQl identifier cannot start with a number or contain '-'
    const cqlId = `cql${shortid.generate().replace(/-/g, 'a')}`;
    let cql = `library ${cqlId} version '1'\nusing FHIR version '4.0.0'\ncontext Patient\n`;
    cql += `define "${criteriaName}":
      ${buildCriteriaCql.cql}`;
    const elm = await convertBasicCQL(cql);
    const criteriaId = addElmCriteria(elm, criteriaName);

    const newPathway = setTransitionCondition(
      pathwayRef.current,
      currentNodeRef.current.key,
      transitionRef.current.id,
      criteriaName,
      elm,
      criteriaId,
      buildCriteriaCql.cql
    );

    updatePathway(newPathway);
    handleBuildCriteriaCancel();
  }, [
    currentNodeRef,
    updatePathway,
    pathwayRef,
    transitionRef,
    buildCriteriaCql,
    criteriaName,
    handleBuildCriteriaCancel,
    addElmCriteria
  ]);

  const transitionSelected = buildCriteriaSelected && buildCriteriaNodeId === transition.id;
  return (
    <>
      {!displayCriteria && !transitionSelected && (
        <SidebarButton
          buttonName="Select Criteria"
          buttonIcon={faThList}
          buttonText="Add previously built or imported criteria logic to branch node."
          onClick={handleUseCriteria}
          disabled={!criteriaAvailable}
          hasTooltip={!criteriaAvailable}
          tooltipTitle="No criteria to select. Add criteria to use."
        />
      )}

      {displayCriteria && !transitionSelected && (
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

      {!displayCriteria && !transitionSelected && (
        <SidebarButton
          buttonName="Build Criteria"
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
          {buildCriteriaCql?.text && (
            <span className={styles.buildCriteriaText}>{buildCriteriaCql.text}</span>
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
              disabled={criteriaName === '' || buildCriteriaCql === null}
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
