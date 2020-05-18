import React, { FC, memo, useState, useCallback, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { SidebarButton, BranchTransition } from '.';
import DropDown from 'components/elements/DropDown';
import {
  setStateCriteriaSource,
  setStateMcodeCriteria,
  setStateOtherCriteria,
  addTransition,
  createState,
  addState
} from 'utils/builder';
import { Pathway, State } from 'pathways-model';
import useStyles from './styles';

const nodeTypeOptions = [
  { value: 'action', label: 'Action' },
  { value: 'branch', label: 'Branch' }
];

const criteriaSourceOptions = [
  { value: 'mcode', label: 'mCODE' },
  { value: 'other', label: 'Other' }
];

const mCodeCriteriaOptions = [
  { value: 'tumorCategory', label: 'Tumor Category' },
  { value: 'nodeCategory', label: 'Node Category' },
  { value: 'metastatisCategory', label: 'Metastatis Category' }
];

const otherCriteriaOptions = [{ value: 'item', label: 'Item' }];

interface BranchNodeProps {
  pathway: Pathway;
  currentNode: State;
  changeNodeType: (event: string) => void;
  updatePathway: (pathway: Pathway) => void;
}

const BranchNode: FC<BranchNodeProps> = ({
  pathway,
  currentNode,
  changeNodeType,
  updatePathway
}) => {
  const [criteriaSource, setCriteriaSource] = useState<string>('');
  const [criteria, setCriteria] = useState<string>('');
  const currentNodeKey = currentNode?.key;
  const styles = useStyles();

  const selectNodeType = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      changeNodeType(event?.target.value || '');
    },
    [changeNodeType]
  );

  const selectCriteriaSource = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeKey) return;

      const criteriaSource = event?.target.value || '';
      updatePathway(setStateCriteriaSource(pathway, currentNodeKey, criteriaSource));
      setCriteriaSource(criteriaSource);
    },
    [currentNodeKey, updatePathway, pathway]
  );

  const selectMcodeCriteria = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeKey) return;

      const mcodeCriteria = event?.target.value || '';
      updatePathway(setStateMcodeCriteria(pathway, currentNodeKey, mcodeCriteria));
      setCriteria(mcodeCriteria);
    },
    [currentNodeKey, updatePathway, pathway]
  );

  const selectOtherCriteria = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeKey) return;

      const otherCriteria = event?.target.value || '';
      updatePathway(setStateOtherCriteria(pathway, currentNodeKey, otherCriteria));
      setCriteria(otherCriteria);
    },
    [currentNodeKey, updatePathway, pathway]
  );

  const handleAddTransition = useCallback((): void => {
    const newState = createState();

    const newPathway = addState(pathway, newState);
    updatePathway(addTransition(newPathway, currentNodeKey || '', newState.key as string));
  }, [pathway, updatePathway, currentNodeKey]);

  return (
    <>
      <DropDown
        id="nodeType"
        label="Node Type"
        options={nodeTypeOptions}
        onChange={selectNodeType}
        initialSelected={nodeTypeOptions.find(option => option.value === 'branch')}
      />

      <DropDown
        id="criteriaSource"
        label="Criteria Source"
        options={criteriaSourceOptions}
        onChange={selectCriteriaSource}
      />

      {criteriaSource === 'mcode' && (
        <DropDown
          id="mCodeCriteria"
          label="mCODE Criteria"
          options={mCodeCriteriaOptions}
          onChange={selectMcodeCriteria}
        />
      )}

      {criteriaSource === 'other' && (
        <DropDown
          id="otherCriteria"
          label="Other Criteria"
          options={otherCriteriaOptions}
          onChange={selectOtherCriteria}
        />
      )}

      {currentNode.transitions.map(transition => {
        return (
          <BranchTransition
            key={transition.id}
            pathway={pathway}
            transition={transition}
            updatePathway={updatePathway}
          />
        );
      })}

      {criteria !== '' && (
        <>
          <hr className={styles.divider} />

          <SidebarButton
            buttonName="Add Transition"
            buttonIcon={<FontAwesomeIcon icon={faPlus} />}
            buttonText="Add transition logic for a clinical decision within a workflow."
            onClick={handleAddTransition}
          />
        </>
      )}
    </>
  );
};

export default memo(BranchNode);
