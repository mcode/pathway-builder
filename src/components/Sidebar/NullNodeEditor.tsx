import React, { FC, memo, useCallback, ChangeEvent } from 'react';

import DropDown from 'components/elements/DropDown';
import { useCurrentNodeContext } from 'components/CurrentNodeProvider';
import useStyles from './styles';
import { nodeTypeOptions } from 'utils/nodeUtils';

interface NullNodeEditorProps {
  changeNodeType: (event: string) => void;
}

const NullNodeEditor: FC<NullNodeEditorProps> = ({ changeNodeType }) => {
  const { currentNode } = useCurrentNodeContext();
  const styles = useStyles();
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
      <h5 className={styles.dividerHeader}>
        <span>Transitions</span>
      </h5>
    </>
  );
};

export default memo(NullNodeEditor);
