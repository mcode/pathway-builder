import React, { FC, memo, useCallback, ChangeEvent } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { SidebarButton, BranchTransition } from '.';
import DropDown from 'components/elements/DropDown';
import { addTransition, createNode, addNode } from 'utils/builder';
import { usePathwaysContext } from 'components/PathwaysProvider';

import useStyles from './styles';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';
import { useCurrentNodeContext } from 'components/CurrentNodeProvider';

const nodeTypeOptions = [
  { value: 'action', label: 'Action' },
  { value: 'branch', label: 'Branch' }
];

interface BranchNodeEditorProps {
  changeNodeType: (event: string) => void;
}

const BranchNodeEditor: FC<BranchNodeEditorProps> = ({ changeNodeType }) => {
  const { updatePathway } = usePathwaysContext();
  const { pathwayRef } = useCurrentPathwayContext();
  const { currentNode, currentNodeRef } = useCurrentNodeContext();
  const styles = useStyles();

  const selectNodeType = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      changeNodeType(event?.target.value || '');
    },
    [changeNodeType]
  );

  const handleAddTransition = useCallback((): void => {
    if (!pathwayRef.current) return;

    const newNode = createNode();

    const newPathway = addNode(pathwayRef.current, newNode);
    updatePathway(
      addTransition(newPathway, currentNodeRef.current?.key || '', newNode.key as string)
    );
  }, [pathwayRef, updatePathway, currentNodeRef]);

  return (
    <>
      <DropDown
        id="nodeType"
        label="Node Type"
        options={nodeTypeOptions}
        onChange={selectNodeType}
        value="branch"
      />
      {currentNode?.transitions.map(transition => {
        return <BranchTransition key={transition.id} transition={transition} />;
      })}

      <hr className={styles.divider} />

      <SidebarButton
        buttonName="Add Transition"
        buttonIcon={faPlus}
        buttonText="Add transition logic for a clinical decision within a workflow."
        onClick={handleAddTransition}
      />
    </>
  );
};

export default memo(BranchNodeEditor);
