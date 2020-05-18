import React, { FC, memo, useCallback, ChangeEvent } from 'react';

import DropDown from 'components/elements/DropDown';
import { Pathway, State } from 'pathways-model';

const nodeTypeOptions = [
  { label: 'Action', value: 'action' },
  { label: 'Branch', value: 'branch' }
];

interface ActionNodeProps {
  pathway: Pathway;
  currentNode: State;
  changeNodeType: (event: string) => void;
}

const ActionNode: FC<ActionNodeProps> = ({ pathway, currentNode, changeNodeType }) => {
  const selectNodeType = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      changeNodeType(event?.target.value || '');
    },
    [changeNodeType]
  );

  return (
    <DropDown
      id="nodeType"
      label="Node Type"
      options={nodeTypeOptions}
      onChange={selectNodeType}
      initialSelected={nodeTypeOptions.find(option => option.value === 'action')}
    />
  );
};

export default memo(ActionNode);
