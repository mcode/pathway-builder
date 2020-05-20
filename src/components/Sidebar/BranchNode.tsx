import React, { FC, memo, useCallback, ChangeEvent } from 'react';
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
import { Pathway, BranchState } from 'pathways-model';
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
  currentNode: BranchState;
  changeNodeType: (event: string) => void;
  updatePathway: (pathway: Pathway) => void;
}

const BranchNode: FC<BranchNodeProps> = ({
  pathway,
  currentNode,
  changeNodeType,
  updatePathway
}) => {
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
    },
    [currentNodeKey, updatePathway, pathway]
  );

  const selectMcodeCriteria = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeKey) return;

      const mcodeCriteria = event?.target.value || '';
      updatePathway(setStateMcodeCriteria(pathway, currentNodeKey, mcodeCriteria));
    },
    [currentNodeKey, updatePathway, pathway]
  );

  const selectOtherCriteria = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeKey) return;

      const otherCriteria = event?.target.value || '';
      updatePathway(setStateOtherCriteria(pathway, currentNodeKey, otherCriteria));
    },
    [currentNodeKey, updatePathway, pathway]
  );

  const handleAddTransition = useCallback((): void => {
    const newState = createState();

    const newPathway = addState(pathway, newState);
    updatePathway(addTransition(newPathway, currentNodeKey || '', newState.key as string));
  }, [pathway, updatePathway, currentNodeKey]);

  const canAddTransition =
    currentNode.criteriaSource != null && (currentNode.mcodeCriteria || currentNode.otherCriteria);

  return (
    <>
      <DropDown
        id="nodeType"
        label="Node Type"
        options={nodeTypeOptions}
        onChange={selectNodeType}
        value="branch"
      />

      <DropDown
        id="criteriaSource"
        label="Criteria Source"
        options={criteriaSourceOptions}
        onChange={selectCriteriaSource}
        value={currentNode.criteriaSource}
      />

      {currentNode.criteriaSource === 'mcode' && (
        <DropDown
          id="mCodeCriteria"
          label="mCODE Criteria"
          options={mCodeCriteriaOptions}
          onChange={selectMcodeCriteria}
          value={currentNode.mcodeCriteria}
        />
      )}

      {currentNode.criteriaSource === 'other' && (
        <DropDown
          id="otherCriteria"
          label="Other Criteria"
          options={otherCriteriaOptions}
          onChange={selectOtherCriteria}
          value={currentNode.otherCriteria}
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

      {canAddTransition && (
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
