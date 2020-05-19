import React, { FC, memo, useCallback, ChangeEvent } from 'react';
import { SidebarButton } from '.';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import DropDown from 'components/elements/DropDown';
import { Pathway, State } from 'pathways-model';
import useStyles from './styles';

const nodeTypeOptions = [
  { label: '', value: '' },
  { label: 'Action', value: 'action' },
  { label: 'Branch', value: 'branch' }
];

interface NullNodeProps {
  pathway: Pathway;
  currentNode: State;
  changeNodeType: (event: string) => void;
  addNode: (event: string) => void;
}

const NullNode: FC<NullNodeProps> = ({ pathway, currentNode, changeNodeType, addNode }) => {
  const styles = useStyles();
  const selectNodeType = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      changeNodeType(event?.target.value || '');
    },
    [changeNodeType]
  );

  // The node has a key and is not the start node
  const changeNodeTypeEnabled = currentNode.key !== undefined && currentNode.key !== 'Start';

  // If the node does not have transitions it can be added to
  const displayAddButtons = currentNode.key !== undefined && currentNode.transitions.length === 0;

  return (
    <>
      {changeNodeTypeEnabled && (
        <DropDown
          id="nodeType"
          label="Node Type"
          options={nodeTypeOptions}
          onChange={selectNodeType}
          initialSelected={nodeTypeOptions.find(option => option.value === '')}
        />
      )}
    </>
  );
};

export default memo(NullNode);
