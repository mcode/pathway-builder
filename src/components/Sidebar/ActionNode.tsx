import React, { FC, memo, useCallback, ChangeEvent } from 'react';
import { SidebarButton } from '.';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

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
  addNode: (event: string) => void;
}

const ActionNode: FC<ActionNodeProps> = ({ pathway, currentNode, changeNodeType, addNode }) => {
  const selectNodeType = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      changeNodeType(event?.target.value || '');
    },
    [changeNodeType]
  );

  return (
    <>
      {!currentNode.key && currentNode.key !== 'Start' && (
        <DropDown
          id="nodeType"
          label="Node Type"
          options={nodeTypeOptions}
          onChange={selectNodeType}
          initialSelected={nodeTypeOptions.find(option => option.value === 'action')}
        />
      )}

      <SidebarButton
        buttonName="Add Action Node"
        buttonIcon={<FontAwesomeIcon icon={faPlus} />}
        buttonText="Any clinical or workflow step which is not a decision."
        onClick={(): void => addNode('action')}
      />

      <SidebarButton
        buttonName="Add Branch Node"
        buttonIcon={<FontAwesomeIcon icon={faPlus} />}
        buttonText="A logical branching point based on clinical or workflow criteria."
        onClick={(): void => addNode('branch')}
      />
    </>
  );
};

export default memo(ActionNode);
