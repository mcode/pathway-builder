import React, { FC, memo, useCallback, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { SidebarButton, BranchTransition } from '.';
import DropDown from 'components/elements/DropDown';
import { addTransition, createNode, addNode } from 'utils/builder';
import { Pathway, PathwayNode } from 'pathways-model';
import { usePathwayContext } from 'components/PathwayProvider';

import useStyles from './styles';

const nodeTypeOptions = [
  { value: 'action', label: 'Action' },
  { value: 'branch', label: 'Branch' }
];

interface BranchNodeEditorProps {
  pathway: Pathway;
  currentNode: PathwayNode;
  changeNodeType: (event: string) => void;
}

const BranchNodeEditor: FC<BranchNodeEditorProps> = ({ pathway, currentNode, changeNodeType }) => {
  const { updatePathway } = usePathwayContext();
  const currentNodeKey = currentNode?.key;
  const styles = useStyles();

  const selectNodeType = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      changeNodeType(event?.target.value || '');
    },
    [changeNodeType]
  );

  const handleAddTransition = useCallback((): void => {
    const newNode = createNode();

    const newPathway = addNode(pathway, newNode);
    updatePathway(addTransition(newPathway, currentNodeKey || '', newNode.key as string));
  }, [pathway, updatePathway, currentNodeKey]);

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
            currentNodeKey={currentNodeKey || ''}
            transition={transition}
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

export default memo(BranchNodeEditor);
