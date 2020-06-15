import React, { FC, memo, useCallback, ChangeEvent } from 'react';
import { SidebarButton } from '.';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { setStateAction } from 'utils/builder';
import DropDown from 'components/elements/DropDown';
import Input from 'components/elements/Input';
import { Pathway, GuidanceState, Action } from 'pathways-model';
import useStyles from './styles';
import shortid from 'shortid';

const nodeTypeOptions = [
  { label: 'Action', value: 'action' },
  { label: 'Branch', value: 'branch' }
];

const actionTypeOptions = [
  { label: 'Medication Request', value: 'Medication Request' },
  { label: 'Service Request', value: 'Service Request' },
  { label: 'Careplan', value: 'Careplan' }
];

const codeSystemOptions = [
  { label: 'RXNORM', value: 'http://www.nlm.nih.gov/research/umls/rxnorm' },
  { label: 'SNOMED', value: 'http://snomed.info/sct' },
  { label: 'LOINC', value: ' http://loinc.org' }
];

interface ActionNodeProps {
  pathway: Pathway;
  currentNode: GuidanceState;
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
      const currentState: GuidanceState = pathway.states[currentNodeKey] as GuidanceState;
      const action: Action = currentState.action[0];
      action.resource.code.coding[0].code = code;
      updatePathway(setStateAction(pathway, currentNodeKey, [action]));
    },
    [currentNodeKey, pathway, updatePathway]
  );

  const changeTitle = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeKey) return;

      const title = event?.target.value || '';
      const currentState: GuidanceState = pathway.states[currentNodeKey] as GuidanceState;
      const action: Action = currentState.action[0];
      action.resource.title = title;
      updatePathway(setStateAction(pathway, currentNodeKey, [action]));
    },
    [currentNodeKey, pathway, updatePathway]
  );

  const selectActionType = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeKey) return;
      const value = event?.target.value || '';
      const actionType = actionTypeOptions.find(option => {
        return option.value === value;
      });
      const currentState: GuidanceState = pathway.states[currentNodeKey] as GuidanceState;
      let action: Action;
      if (actionType?.label === 'Careplan') {
        action = {
          type: 'create',
          description: '',
          resource: {
            id: shortid.generate(),
            resourceType: actionType?.label,
            title: ''
          }
        };
      } else if (
        currentState.action.length > 0 &&
        currentState.action[0].resource.resourceType !== 'Careplan'
      ) {
        action = currentState.action[0];
        action.resource.resourceType = actionType?.label;
      } else {
        action = {
          type: 'create',
          description: '',
          resource: {
            id: shortid.generate(),
            resourceType: actionType?.label,
            code: {
              coding: [
                {
                  system: '',
                  code: '',
                  display: ''
                }
              ]
            }
          }
        };
      }

      updatePathway(setStateAction(pathway, currentNodeKey, [action]));
    },
    [currentNodeKey, pathway, updatePathway]
  );

  const selectCodeSystem = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeKey) return;

      const codeSystem = event?.target.value || '';
      const currentState: GuidanceState = pathway.states[currentNodeKey] as GuidanceState;
      const action: Action = currentState.action[0];
      action.resource.code.coding[0].system = codeSystem;
      updatePathway(setStateAction(pathway, currentNodeKey, [action]));
    },
    [currentNodeKey, pathway, updatePathway]
  );
  // The node has a key and is not the start node
  const changeNodeTypeEnabled = currentNode.key !== undefined && currentNode.key !== 'Start';

  const action = currentNode.action;
  const resource = action && action.length > 0 && action[0].resource;
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
            value={resource && resource.resourceType}
          />
          {(resource.resourceType === 'Medication Request' ||
            resource.resourceType === 'Service Request') && (
            <>
              <DropDown
                id="codeSystem"
                label="Code System"
                options={codeSystemOptions}
                onChange={selectCodeSystem}
                value={resource.code.coding[0].system}
              />
              {resource.code.coding[0].system && (
                <Input
                  id="code"
                  label="Code"
                  onChange={changeCode}
                  value={resource.code.coding[0].code}
                />
              )}
              {resource.code.coding[0].system && (
                <SidebarButton
                  buttonName="Validate"
                  buttonIcon={<FontAwesomeIcon icon={faCheckCircle} />}
                  buttonText="Check validation of the input system and code"
                  onClick={(): void => console.log('todo')}
                />
              )}
            </>
          )}

          {resource.resourceType === 'Careplan' && (
            // design for careplan ?
            <>
              <Input id="title" label="Title" onChange={changeTitle} value={resource.title} />
              {resource.title && (
                <SidebarButton
                  buttonName="Validate"
                  buttonIcon={<FontAwesomeIcon icon={faCheckCircle} />}
                  buttonText="Check validation of the input Careplan"
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
