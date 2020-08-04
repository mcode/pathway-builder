import React, { FC, memo, useCallback, ChangeEvent } from 'react';
import { SidebarButton } from '.';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import {
  setNodeAction,
  createCQL,
  setActionNodeElm,
  setActionResourceDisplay
} from 'utils/builder';
import DropDown from 'components/elements/DropDown';
import { ActionNode, Action } from 'pathways-model';
import { ElmLibrary } from 'elm-model';
import useStyles from './styles';
import { TextField } from '@material-ui/core';
import { convertBasicCQL } from 'engine/cql-to-elm';
import { usePathwaysContext } from 'components/PathwaysProvider';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';
import produce from 'immer';
import { useCurrentNodeContext } from 'components/CurrentNodeProvider';
import { nodeTypeOptions } from 'utils/nodeUtils';

const codeSystemOptions = [
  { label: 'ICD-9-CM', value: 'http://hl7.org/fhir/sid/icd-9-cm' },
  { label: 'ICD-10-CM', value: 'http://hl7.org/fhir/sid/icd-10-cm' },
  { label: 'LOINC', value: 'http://loinc.org' },
  { label: 'NCI', value: 'http://ncimeta.nci.nih.gov' },
  { label: 'RXNORM', value: 'http://www.nlm.nih.gov/research/umls/rxnorm' },
  { label: 'SNOMED', value: 'http://snomed.info/sct' }
];

interface ActionNodeEditorProps {
  changeNodeType: (event: string) => void;
}

const ActionNodeEditor: FC<ActionNodeEditorProps> = ({ changeNodeType }) => {
  const { updatePathway } = usePathwaysContext();
  const { pathwayRef } = useCurrentPathwayContext();
  const { currentNode, currentNodeRef } = useCurrentNodeContext();
  const styles = useStyles();

  const selectNodeType = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      changeNodeType(event?.target.value || '');
    },
    [changeNodeType]
  );

  const addActionCQL = useCallback(
    (action: Action, currentNodeKey: string): void => {
      if (!pathwayRef.current) return;

      const cql = createCQL(action, currentNodeKey);
      convertBasicCQL(cql).then(elm => {
        // Disable lint for no-null assertion since it is already checked above
        // eslint-disable-next-line
        updatePathway(setActionNodeElm(pathwayRef.current!, currentNodeKey, elm as ElmLibrary));
      });
    },
    [pathwayRef, updatePathway]
  );

  const changeCode = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeRef.current?.key || !pathwayRef.current) return;

      const code = event?.target.value || '';
      const action = produce(
        (currentNodeRef.current as ActionNode).action[0],
        (draftAction: Action) => {
          if (draftAction.resource.medicationCodeableConcept) {
            draftAction.resource.medicationCodeableConcept.coding[0].code = code;
          } else {
            draftAction.resource.code.coding[0].code = code;
          }
        }
      );
      updatePathway(
        setNodeAction(pathwayRef.current, currentNodeRef.current.key, [resetDisplay(action)])
      );
    },
    [currentNodeRef, pathwayRef, updatePathway]
  );

  const changeDescription = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeRef.current?.key || !pathwayRef.current) return;

      const description = event?.target.value || '';
      const action = produce(
        (currentNodeRef.current as ActionNode).action[0],
        (draftAction: Action) => {
          draftAction.description = description;
        }
      );
      updatePathway(setNodeAction(pathwayRef.current, currentNodeRef.current.key, [action]));
    },
    [currentNodeRef, pathwayRef, updatePathway]
  );

  const changeTitle = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeRef.current?.key || !pathwayRef.current) return;

      const title = event?.target.value || '';
      const action = produce(
        (currentNodeRef.current as ActionNode).action[0],
        (draftAction: Action) => {
          draftAction.resource.title = title;
        }
      );
      updatePathway(
        setNodeAction(pathwayRef.current, currentNodeRef.current.key, [resetDisplay(action)])
      );

      addActionCQL(action, currentNodeRef.current.key);
    },
    [currentNodeRef, pathwayRef, updatePathway, addActionCQL]
  );

  const selectCodeSystem = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeRef.current?.key || !pathwayRef.current) return;

      const codeSystem = event?.target.value || '';
      const action = produce(
        (currentNodeRef.current as ActionNode).action[0],
        (draftAction: Action) => {
          if (draftAction.resource.medicationCodeableConcept) {
            draftAction.resource.medicationCodeableConcept.coding[0].system = codeSystem;
          } else {
            draftAction.resource.code.coding[0].system = codeSystem;
          }
        }
      );
      updatePathway(
        setNodeAction(pathwayRef.current, currentNodeRef.current.key, [resetDisplay(action)])
      );
    },
    [currentNodeRef, pathwayRef, updatePathway]
  );

  const validateFunction = useCallback((): void => {
    if (
      currentNodeRef.current?.key &&
      (currentNodeRef.current as ActionNode).action.length &&
      pathwayRef.current
    ) {
      const action = setActionResourceDisplay(
        (currentNodeRef.current as ActionNode).action[0],
        'Example Text'
      );
      updatePathway(setNodeAction(pathwayRef.current, currentNodeRef.current.key, [action]));

      addActionCQL(action, currentNodeRef.current.key);
    } else {
      console.error('No Actions -- Cannot Validate');
    }
  }, [currentNodeRef, pathwayRef, updatePathway, addActionCQL]);

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
  const changeNodeTypeEnabled = currentNode?.key !== undefined && currentNode.key !== 'Start';
  const action = (currentNode as ActionNode).action;
  const resource = action?.length > 0 && action[0].resource;
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
            onChange={selectNodeType}
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
                    value={action[0].description || ''}
                    onChange={changeDescription}
                    variant="outlined"
                    error={action[0].description === ''}
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
                  value={action[0].description || ''}
                  onChange={changeDescription}
                  variant="outlined"
                  error={action[0].description === ''}
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
