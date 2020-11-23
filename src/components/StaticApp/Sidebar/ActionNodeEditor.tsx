import React, { FC, memo, useCallback, ChangeEvent } from 'react';
import { SidebarButton } from 'components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import {
  setNodeAction,
  createCQL,
  setActionNodeElm,
  setActionResourceDisplay,
  setActionCode,
  setActionDescription,
  setActionTitle,
  setActionCodeSystem
} from 'utils/builder';
import DropDown from 'components/elements/DropDown';
import { ActionNode, Action, PathwayNode } from 'pathways-model';
import useStyles from 'components/Sidebar/styles';
import { TextField } from '@material-ui/core';
import { convertBasicCQL } from 'engine/cql-to-elm';
import { useCurrentPathwayContext } from 'components/StaticApp/CurrentPathwayProvider';
import produce from 'immer';
import { nodeTypeOptions } from 'utils/nodeUtils';
import useCurrentNodeStatic from 'hooks/useCurrentNodeStatic';

const codeSystemOptions = [
  { label: 'ICD-9-CM', value: 'http://hl7.org/fhir/sid/icd-9-cm' },
  { label: 'ICD-10-CM', value: 'http://hl7.org/fhir/sid/icd-10-cm' },
  { label: 'LOINC', value: 'http://loinc.org' },
  { label: 'NCI', value: 'http://ncimeta.nci.nih.gov' },
  { label: 'RXNORM', value: 'http://www.nlm.nih.gov/research/umls/rxnorm' },
  { label: 'SNOMED', value: 'http://snomed.info/sct' }
];

interface ActionNodeEditorProps {
  currentNode: PathwayNode | null;
  changeNodeType: (event: string) => void;
}

const ActionNodeEditor: FC<ActionNodeEditorProps> = ({ currentNode, changeNodeType }) => {
  const { pathway, pathwayRef, setCurrentPathway } = useCurrentPathwayContext();
  const currentNodeStatic = useCurrentNodeStatic(pathway);
  const styles = useStyles();

  const addActionCQL = useCallback(
    (action: Action, currentNodeKey: string): void => {
      if (!pathwayRef.current) return;

      const cql = createCQL(action, currentNodeKey);
      convertBasicCQL(cql).then(elm => {
        // Disable lint for no-null assertion since it is already checked above
        // eslint-disable-next-line
        setCurrentPathway(setActionNodeElm(pathwayRef.current!, currentNodeKey, elm));
      });
    },
    [pathwayRef, setCurrentPathway]
  );

  const changeCode = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      const currentNode = currentNodeStatic as ActionNode;
      if (!currentNode.action || !pathwayRef.current) return;

      const code = event?.target.value || '';
      const action = setActionCode(currentNode.action, code);
      setCurrentPathway(setNodeAction(pathwayRef.current, currentNode.key, resetDisplay(action)));
    },
    [currentNodeStatic, pathwayRef, setCurrentPathway]
  );

  const changeDescription = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      const currentNode = currentNodeStatic as ActionNode;
      if (!currentNode.action || !pathwayRef.current) return;

      const description = event?.target.value || '';
      const action = setActionDescription(currentNode.action, description);
      setCurrentPathway(setNodeAction(pathwayRef.current, currentNode.key, action));
    },
    [currentNodeStatic, pathwayRef, setCurrentPathway]
  );

  const changeTitle = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      const currentNode = currentNodeStatic as ActionNode;
      if (!currentNode.action || !pathwayRef.current) return;

      const title = event?.target.value || '';
      const action = setActionTitle(currentNode.action, title);
      setCurrentPathway(setNodeAction(pathwayRef.current, currentNode.key, resetDisplay(action)));

      addActionCQL(action, currentNode.key);
    },
    [currentNodeStatic, pathwayRef, setCurrentPathway, addActionCQL]
  );

  const selectCodeSystem = useCallback(
    (codeSystem: string): void => {
      const currentNode = currentNodeStatic as ActionNode;
      if (!currentNode.action || !pathwayRef.current) return;
      const action = setActionCodeSystem(currentNode.action, codeSystem);
      setCurrentPathway(setNodeAction(pathwayRef.current, currentNode.key, resetDisplay(action)));
    },
    [currentNodeStatic, pathwayRef, setCurrentPathway]
  );

  const validateFunction = useCallback((): void => {
    const currentNode = currentNodeStatic as ActionNode;
    if (!currentNode.action || !pathwayRef.current) {
      console.error('No Actions -- Cannot Validate');
      return;
    }

    const action = setActionResourceDisplay(currentNode.action, 'Example Text');
    setCurrentPathway(setNodeAction(pathwayRef.current, currentNode.key, action));

    // TODO: move addActionCQL to builder.ts
    addActionCQL(action, currentNode.key);
  }, [currentNodeStatic, pathwayRef, setCurrentPathway, addActionCQL]);

  const resetDisplay = (action: Action): Action => {
    return produce(action, (draftAction: Action) => {
      if (draftAction.resource.medicationCodeableConcept) {
        draftAction.resource.medicationCodeableConcept.coding[0].display = '';
      } else if (draftAction.resource.resourceType === 'CarePlan') {
        draftAction.resource.description = '';
      } else {
        draftAction.resource.code.coding[0].display = ''; // TODO: actually validate
      }
    });
  };

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      validateFunction();
    }
  };

  // The node has a key and is not the start node
  const action = (currentNode as ActionNode).action;
  if (!action) return <></>;

  const changeNodeTypeEnabled = currentNode?.key && currentNode.type !== 'start';
  const resource = action.resource;
  let system = '';
  let code = '';
  let display = '';
  if (resource.resourceType === 'MedicationRequest' || resource.resourceType === 'ServiceRequest') {
    system = resource.code
      ? resource.code.coding[0].system
      : resource.medicationCodeableConcept.coding[0].system;
    code = resource.code
      ? resource.code.coding[0].code
      : resource.medicationCodeableConcept.coding[0].code;
    display = resource.code
      ? resource.code.coding[0].display
      : resource.medicationCodeableConcept.coding[0].display;
  } else {
    display = resource.description;
  }

  return (
    <>
      {changeNodeTypeEnabled && (
        <>
          <DropDown
            id="nodeType"
            label="Node Type"
            options={nodeTypeOptions}
            onChange={changeNodeType}
            value={resource.resourceType}
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
                  inputProps={{ onKeyPress: onEnter }}
                />
              )}
              {code && (
                <>
                  {display ? (
                    <div className={styles.displayText}>
                      <FontAwesomeIcon icon={faCheckCircle} /> {display}
                    </div>
                  ) : (
                    <SidebarButton
                      buttonName="Validate"
                      buttonIcon={faCheckCircle}
                      buttonText={display || 'Check validation of the input system and code'}
                      onClick={validateFunction}
                    />
                  )}

                  <TextField
                    id="description-input"
                    label="Description"
                    value={action.description || ''}
                    onChange={changeDescription}
                    variant="outlined"
                    error={action.description === ''}
                  />
                </>
              )}
            </>
          )}

          {resource.resourceType === 'CarePlan' && (
            <>
              <TextField
                id="title-input"
                label="Title"
                value={resource.title || ''}
                onChange={changeTitle}
                variant="outlined"
                error={resource.title == null}
                inputProps={{ onKeyPress: onEnter }}
              />
              {resource.title && (
                <TextField
                  id="description-input"
                  label="Description"
                  value={action.description || ''}
                  onChange={changeDescription}
                  variant="outlined"
                  error={action.description === ''}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default memo(ActionNodeEditor);
