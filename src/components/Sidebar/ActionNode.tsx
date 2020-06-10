import React, { FC, memo, useCallback, ChangeEvent } from 'react';
import { SidebarButton } from '.';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { setStateActionType, setStateCodeSystem, setStateCode } from 'utils/builder';
import DropDown from 'components/elements/DropDown';
import Input from 'components/elements/Input';
import { Pathway, ActionState } from 'pathways-model';
import useStyles from './styles';

const nodeTypeOptions = [
  { label: 'Action', value: 'action' },
  { label: 'Branch', value: 'branch' }
];

const actionTypeOptions = [
  { label: 'Medication Request', value: 'medicationrequest' },
  { label: 'Service Request', value: 'servicerequest' },
  { label: 'Careplan', value: 'careplan' }
];

const codeSystemOptions = [
  { label: 'RXNORM', value: 'rxnorm' },
  { label: 'SNOMED', value: 'snomed' },
  { label: 'ICD-10', value: 'icd10' },
  { label: 'ICD-9', value: 'icd9' }
];

interface ActionNodeProps {
  pathway: Pathway;
  currentNode: ActionState;
  changeNodeType: (event: string) => void;
  addNode: (event: string) => void;
  updatePathway: (pathway: Pathway) => void;
}

const ActionNode: FC<ActionNodeProps> = ({
  pathway,
  currentNode,
  changeNodeType,
  addNode,
  updatePathway
}) => {
  const styles = useStyles();
  const selectNodeType = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      changeNodeType(event?.target.value || '');
    },
    [changeNodeType]
  );
  const currentNodeKey = currentNode?.key;

  const changeCode = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeKey) return;

      const code = event?.target.value || '';
      updatePathway(setStateCode(pathway, currentNodeKey, code));
    },
    [currentNodeKey, pathway, updatePathway]
  );
  const selectActionType = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeKey) return;

      const actionType = event?.target.value || '';
      updatePathway(setStateActionType(pathway, currentNodeKey, actionType));
    },
    [currentNodeKey, pathway, updatePathway]
  );

  const selectCodeSystem = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeKey) return;

      const codeSystem = event?.target.value || '';
      updatePathway(setStateCodeSystem(pathway, currentNodeKey, codeSystem));
    },
    [currentNodeKey, pathway, updatePathway]
  );
  // The node has a key and is not the start node
  const changeNodeTypeEnabled = currentNode.key !== undefined && currentNode.key !== 'Start';

  // If the node does not have transitions it can be added to
  const displayAddButtons = currentNode.key !== undefined && currentNode.transitions.length === 0;

  return (
    <>
      {changeNodeTypeEnabled && (
        <>
          <DropDown
            id="nodeType"
            label="Node Type"
            options={nodeTypeOptions}
            onChange={selectNodeType}
            value="action"
          />
          <DropDown
            id="actionType"
            label="Action Type"
            options={actionTypeOptions}
            onChange={selectActionType}
            value={currentNode.actionType}
          />
          {(currentNode.actionType === 'medicationrequest' ||
            currentNode.actionType === 'servicerequest') && (
            <>
              <DropDown
                id="codeSystem"
                label="Code System"
                options={codeSystemOptions}
                onChange={selectCodeSystem}
                value={currentNode.codeSystem}
              />
              {currentNode.codeSystem && (
                <Input id="code" label="Code" onChange={changeCode} value={currentNode.code} />
              )}
              {currentNode.code && (
                <SidebarButton
                  buttonName="Validate"
                  buttonIcon={<FontAwesomeIcon icon={faCheckCircle} />}
                  buttonText="Check validation of the input system and code"
                  onClick={(): void => console.log('todo')}
                />
              )}
            </>
          )}

          {currentNode.actionType === 'careplan' && (
            // design for careplan ?
            <>
              <DropDown
                id="codeSystem"
                label="Code System"
                options={codeSystemOptions}
                onChange={selectCodeSystem}
                value={currentNode.codeSystem}
              />
              {currentNode.codeSystem && (
                <Input id="code" label="Code" onChange={changeCode} value={currentNode.code} />
              )}
              {currentNode.code && (
                <SidebarButton
                  buttonName="Validate"
                  buttonIcon={<FontAwesomeIcon icon={faCheckCircle} />}
                  buttonText="Check validation of the input system and code"
                  onClick={(): void => console.log('todo')}
                />
              )}
            </>
          )}
        </>
      )}
      {displayAddButtons && (
        <>
          {changeNodeTypeEnabled && <hr className={styles.divider} />}
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
      )}
    </>
  );
};

export default memo(ActionNode);
