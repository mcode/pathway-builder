import React, { FC, memo, useCallback, ChangeEvent } from 'react';

import DropDown from 'components/elements/DropDown';
import { Pathway, State } from 'pathways-model';

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
  const selectNodeType = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      changeNodeType(event?.target.value || '');
    },
    [changeNodeType]
  );

  // The node has a key and is not the start node
  const changeNodeTypeEnabled = currentNode.key !== undefined && currentNode.key !== 'Start';

  return (
    <>
      {changeNodeTypeEnabled && (
        <DropDown
          id="nodeType"
          label="Node Type"
          options={nodeTypeOptions}
          onChange={selectNodeType}
          value=""
        />
      )}
    </>
  );
};

export default memo(NullNode);
