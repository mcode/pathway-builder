import React, { FC, memo, useState, useCallback, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTools } from '@fortawesome/free-solid-svg-icons';
import DropDown from 'components/elements/DropDown';
import { TextField, FormControl } from '@material-ui/core';
import { setTransitionCondition, setTransitionConditionDescription } from 'utils/builder';
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
  const criteriaOptions = criteria.map(c => ({ value: c.id, label: c.label }));
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
            value={transition.condition?.cql || undefined}
          />
          <FormControl variant="outlined" fullWidth>
            <TextField
              label="Criteria display"
              value={transition.condition?.description || ''}
              variant="outlined"
              onChange={setCriteriaDisplay}
              error={!transition.condition?.description}
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
