import React, { FC, memo, useCallback, ChangeEvent } from 'react';

import DropDown from 'components/elements/DropDown';
import { useCurrentNodeContext } from 'components/CurrentNodeProvider';

const nodeTypeOptions = [
  { label: '', value: '' },
  { label: 'Action', value: 'action' },
  { label: 'Branch', value: 'branch' }
];

interface NullNodeEditorProps {
  changeNodeType: (event: string) => void;
}

const NullNodeEditor: FC<NullNodeEditorProps> = ({ changeNodeType }) => {
  const { currentNode } = useCurrentNodeContext();
  const selectNodeType = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      changeNodeType(event?.target.value || '');
    },
    [changeNodeType]
  );

  // The node has a key and is not the start node
  const changeNodeTypeEnabled = currentNode?.key !== undefined && currentNode.key !== 'Start';

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

export default memo(NullNodeEditor);
