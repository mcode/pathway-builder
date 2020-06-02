import React, { FC, memo, useCallback, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { SidebarButton, BranchTransition } from '.';
import DropDown from 'components/elements/DropDown';
import { addTransition, createState, addState } from 'utils/builder';
import { Pathway, BranchState } from 'pathways-model';
import useStyles from './styles';

const nodeTypeOptions = [
  { value: 'action', label: 'Action' },
  { value: 'branch', label: 'Branch' }
];

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

  const handleAddTransition = useCallback((): void => {
    const newState = createState();

    const newPathway = addState(pathway, newState);
    updatePathway(addTransition(newPathway, currentNodeKey || '', newState.key as string));
  }, [pathway, updatePathway, currentNodeKey]);

  console.log('node re-render');
  return (
    <>
      <DropDown
        id="nodeType"
        label="Node Type"
        options={nodeTypeOptions}
        onChange={selectNodeType}
        value="branch"
      />
      {currentNode.transitions.map(transition => {
        return (
          <BranchTransition
            key={transition.id}
            pathway={pathway}
            transition={transition}
            currentNodeKey={currentNodeKey || ''}
            updatePathway={updatePathway}
          />
        );
      })}

      <hr className={styles.divider} />

      <SidebarButton
        buttonName="Add Transition"
        buttonIcon={<FontAwesomeIcon icon={faPlus} />}
        buttonText="Add transition logic for a clinical decision within a workflow."
        onClick={handleAddTransition}
      />
    </>
  );
};

export default memo(BranchNode);
