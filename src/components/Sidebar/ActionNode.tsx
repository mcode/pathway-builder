import React, { FC, memo, useCallback, ChangeEvent } from 'react';
import { SidebarButton } from '.';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { setStateAction, setActionDescription } from 'utils/builder';
import DropDown from 'components/elements/DropDown';
import { Pathway, GuidanceState, Action } from 'pathways-model';
import useStyles from './styles';
import shortid from 'shortid';
import { TextField } from '@material-ui/core';

const nodeTypeOptions = [
  { label: 'Action', value: 'action' },
  { label: 'Branch', value: 'branch' }
];

const actionTypeOptions = [
  { label: 'Medication', value: 'MedicationRequest' },
  { label: 'Procedure', value: 'ServiceRequest' },
  { label: 'Regimen', value: 'Careplan' }
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

  const changeCode = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNode.key) return;

      const code = event?.target.value || '';
      const action: Action = currentNode.action[0];
      if (action.resource.medicationCodeableConcept) {
        action.resource.medicationCodeableConcept.coding[0].code = code;
      } else {
        action.resource.code.coding[0].code = code;
      }
      updatePathway(setStateAction(pathway, currentNode.key, [action]));
    },
    [currentNode, pathway, updatePathway]
  );

  const changeDescription = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNode.key) return;

      const description = event?.target.value || '';
      const actionId = currentNode.action[0].id;
      if (actionId) {
        setActionDescription(pathway, currentNode.key, actionId, description, updatePathway);
      }
    },
    [currentNode, pathway, updatePathway]
  );

  const changeTitle = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNode.key) return;

      const title = event?.target.value || '';
      const action = currentNode.action[0];
      action.resource.title = title;
      updatePathway(setStateAction(pathway, currentNode.key, [action]));
    },
    [currentNode, pathway, updatePathway]
  );

  const selectActionType = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNode.key) return;
      const value = event?.target.value || '';
      const actionType = actionTypeOptions.find(option => {
        return option.value === value;
      });
      let action: Action;
      if (actionType?.value === 'Careplan') {
        action = {
          type: 'create',
          description: '',
          id: shortid.generate(),
          resource: {
            resourceType: actionType?.value,
            title: ''
          }
        };
      } else if (actionType?.value === 'MedicationRequest') {
        action = {
          type: 'create',
          description: '',
          id: shortid.generate(),
          resource: {
            resourceType: actionType?.value,
            medicationCodeableConcept: {
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
      } else {
        action = {
          type: 'create',
          description: '',
          id: shortid.generate(),
          resource: {
            resourceType: actionType?.value,
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

      updatePathway(setStateAction(pathway, currentNode.key, [action]));
    },
    [currentNode, pathway, updatePathway]
  );

  const selectCodeSystem = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNode.key) return;

      const codeSystem = event?.target.value || '';
      const action = currentNode.action[0];
      if (action.resource.medicationCodeableConcept) {
        action.resource.medicationCodeableConcept.coding[0].system = codeSystem;
      } else {
        action.resource.code.coding[0].system = codeSystem;
      }
      updatePathway(setStateAction(pathway, currentNode.key, [action]));
    },
    [currentNode, pathway, updatePathway]
  );
  // The node has a key and is not the start node
  const changeNodeTypeEnabled = currentNode.key !== undefined && currentNode.key !== 'Start';

  const action = currentNode.action;
  const resource = action?.length > 0 && action[0].resource;
  let system = '';
  let code = '';
  if (resource.resourceType === 'MedicationRequest' || resource.resourceType === 'ServiceRequest') {
    system = resource.code
      ? resource.code.coding[0].system
      : resource.medicationCodeableConcept.coding[0].system;

    code = resource.code
      ? resource.code.coding[0].code
      : resource.medicationCodeableConcept.coding[0].code;
  }
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
          {(resource.resourceType === 'MedicationRequest' ||
            resource.resourceType === 'ServiceRequest') && (
            <>
              <DropDown
                id="codeSystem"
                label="Code System"
                options={codeSystemOptions}
                onChange={selectCodeSystem}
                value={system}
              />
              {system && (
                <TextField
                  id="code-input"
                  label="Code"
                  value={code}
                  onChange={changeCode}
                  variant="outlined"
                  error={code === ''}
                />
              )}
              {code && (
                <>
                  <SidebarButton
                    buttonName="Validate"
                    buttonIcon={<FontAwesomeIcon icon={faCheckCircle} />}
                    buttonText="Check validation of the input system and code"
                    onClick={(): void => console.log('todo')}
                  />

                  <TextField
                    id="description-input"
                    label="Description"
                    value={action[0].description || ''}
                    onChange={changeDescription}
                    variant="outlined"
                    error={action[0].description === ''}
                  />
                </>
              )}
            </>
          )}

          {resource.resourceType === 'Careplan' && (
            // design for careplan ?
            <>
              <TextField
                id="title-input"
                label="Title"
                value={resource.title || ''}
                onChange={changeTitle}
                variant="outlined"
                error={resource.title == null}
              />
              {resource.title && (
                <>
                  <SidebarButton
                    buttonName="Validate"
                    buttonIcon={<FontAwesomeIcon icon={faCheckCircle} />}
                    buttonText="Check validation of the input Careplan"
                    onClick={(): void => console.log('todo')}
                  />

                  <TextField
                    id="description-input"
                    label="Description"
                    value={action[0].description || ''}
                    onChange={changeDescription}
                    variant="outlined"
                    error={action[0].description === ''}
                  />
                </>
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
