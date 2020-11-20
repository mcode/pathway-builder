import {
  Pathway,
  Precondition,
  PathwayNode,
  Transition,
  Action,
  ActionNode,
  BranchNode,
  ReferenceNode,
  ActionCqlLibrary
} from 'pathways-model';
import { ElmLibrary, ElmStatement } from 'elm-model';
import shortid from 'shortid';
import produce from 'immer';
import { CPGExporter } from './cpg';
import { CaminoExporter } from './CaminoExporter';
import { Criteria } from 'criteria-model';
import { Bundle } from 'fhir-objects';
import JSZip from 'jszip';
import { convertBasicCQL } from 'engine/cql-to-elm';
import { isActionNode } from './nodeUtils';

interface AddCriteriaSourceInterface {
  updated: boolean;
  newPathway: Pathway;
}

export function createNewPathway(name: string, description: string, pathwayId?: string): Pathway {
  return {
    id: pathwayId ?? shortid.generate(),
    name: name,
    description: description,
    library: [''],
    preconditions: [],
    nodes: {
      Start: {
        key: 'Start',
        label: 'Start',
        transitions: [],
        type: 'start'
      }
    }
  };
}

export function updatePathwayCriteriaSources(
  pathway: Pathway,
  criteria: Criteria[]
): AddCriteriaSourceInterface {
  let updated = false;
  const criteriaIds = criteria.map(crit => crit.id);
  const newPathway = produce(pathway, draftPathway => {
    Object.entries(draftPathway.nodes).forEach(([nodeIndex, node]) => {
      node.transitions.forEach(({ condition }, transitionIndex) => {
        // If a matching criteria does not already exist, try and find one
        if (condition && !criteriaIds.includes(condition.criteriaSource as string)) {
          const [library, statement] = condition.cql.split('.');
          const criteriaSource = criteria.find(
            crit => crit.elm?.library.identifier.id === library && crit.statement === statement
          )?.id;
          // Only update if a criteria source is actually found.
          if (criteriaSource) {
            const condition = draftPathway.nodes[nodeIndex].transitions[transitionIndex].condition;
            if (condition) {
              updated = true;
              condition.criteriaSource = criteriaSource;
            }
          }
        }
      });
    });
  });
  return { updated, newPathway };
}

function addCriteriaSource(pathways: Pathway[], criteria: Criteria[]): Pathway[] {
  return pathways.map(pathway => updatePathwayCriteriaSources(pathway, criteria).newPathway);
}

export function downloadPathway(
  pathwaysToExport: Pathway[],
  allPathways: Pathway[],
  criteria: Criteria[],
  cpg = false
): Promise<void> {
  pathwaysToExport = addCriteriaSource(pathwaysToExport, criteria);
  if (pathwaysToExport.length > 1) {
    const zip = new JSZip();
    // If multiple pathways are being exported
    pathwaysToExport.forEach(path => {
      zip.file(`${path.name}.json`, exportPathway(path, allPathways, criteria, cpg));
    });
    return zip.generateAsync({ type: 'blob' }).then(function(content) {
      downloadFile(content, 'pathways.zip');
    });
  } else {
    return exportPathway(pathwaysToExport[0], allPathways, criteria, cpg).then(pathwayString => {
      // Create blob from pathwayString to save to file system
      const pathwayBlob = new Blob([pathwayString], {
        type: 'application/json'
      });
      downloadFile(pathwayBlob, `${pathwaysToExport[0].name}.json`);
    });
  }
}

function downloadFile(file: Blob, fileName: string): void {
  // Temporarily create hidden <a> tag to download pathwayBlob
  // File name is set to <pathway-name>.json
  const url = window.URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
}

export async function exportPathway(
  pathway: Pathway,
  pathways: Pathway[],
  criteria: Criteria[],
  cpg: boolean
): Promise<string> {
  const actionNodeCqlLibraries = generateActionNodeCql(pathway);
  return generateNavigationalElm(pathway, actionNodeCqlLibraries).then(elmLibraries => {
    const pathwayWithElm = setNavigationalElm(pathway, elmLibraries);
    let pathwayToExport: Pathway | Bundle;
    if (cpg) {
      const exporter = new CPGExporter(pathwayWithElm, pathways, criteria);
      pathwayToExport = exporter.export();
    } else {
      const exporter = new CaminoExporter(pathwayWithElm, criteria, actionNodeCqlLibraries);
      pathwayToExport = exporter.export();
    }
    return JSON.stringify(pathwayToExport, undefined, 2);
  });
}

async function generateNavigationalElm(
  pathway: Pathway,
  actionNodeCqlLibraries: ActionCqlLibrary[]
): Promise<ElmLibrary[]> {
  const mainElm: ElmLibrary = {
    library: {
      identifier: {
        id: pathway.id,
        version: '1.0.0'
      },
      schemaIdentifier: {
        id: 'urn:hl7-org:elm',
        version: 'r1'
      },
      usings: {
        def: [
          {
            localIdentifier: 'System',
            uri: 'urn:hl7-org:elm-types:r1'
          },
          {
            localId: '1',
            locator: '3:1-3:26',
            localIdentifier: 'FHIR',
            uri: 'http://hl7.org/fhir',
            version: '4.0.0'
          }
        ]
      },
      statements: {
        def: [
          {
            locator: '13:1-13:15',
            name: 'Patient',
            context: 'Patient',
            expression: {
              type: 'SingletonFrom',
              operand: {
                locator: '13:1-13:15',
                dataType: '{http://hl7.org/fhir}Patient',
                type: 'Retrieve'
              }
            }
          }
        ]
      },
      includes: { def: [] },
      valueSets: { def: [] },
      codes: { def: [] },
      codeSystems: { def: [] }
    }
  };

  // Convert action node cql to elm
  const listOfPromises: Promise<ElmLibrary>[] = [];
  actionNodeCqlLibraries.forEach(cqlLibrary =>
    listOfPromises.push(convertBasicCQL(cqlLibrary.cql))
  );

  for (const nodeKey of Object.keys(pathway.nodes)) {
    const node = pathway.nodes[nodeKey];

    node.transitions.forEach((transition: Transition) => {
      if (transition.condition?.elm) {
        // Add tranistion.condition.elm to elm
        mergeElm(mainElm, transition.condition.elm);
        const elmStatement = produce(
          getElmStatement(transition.condition.elm),
          (draftElmStatement: ElmStatement) => {
            draftElmStatement.name = transition.condition?.description ?? 'Unknown';
          }
        );
        mainElm.library.statements.def.push(elmStatement);
      }
    });
  }

  return Promise.all(listOfPromises).then(elmLibraries => {
    return [mainElm, ...elmLibraries];
  });
}

function generateActionNodeCql(pathway: Pathway): ActionCqlLibrary[] {
  const libraries: ActionCqlLibrary[] = [];

  Object.keys(pathway.nodes).forEach(nodeKey => {
    const node = pathway.nodes[nodeKey];
    if (isActionNode(node)) libraries.push(createCQL(node.action, nodeKey));
  });

  return libraries;
}

function mergeElm(elm: ElmLibrary, additionalElm: ElmLibrary): void {
  // Merge usings
  additionalElm.library.usings?.def.forEach(using => {
    // Check if it is in ELM
    if (!elm.library.usings?.def.find(def => def.uri === using.uri))
      elm.library.usings?.def.push(using);
  });

  // Merge includes
  additionalElm.library.includes?.def.forEach(include => {
    if (!elm.library.includes?.def.find(def => def.path === include.path))
      elm.library.includes?.def.push(include);
  });

  // Merge valueSets
  additionalElm.library.valueSets?.def.forEach(valueSet => {
    if (!elm.library.valueSets?.def.find(def => def.id === valueSet.id))
      elm.library.valueSets?.def.push(valueSet);
  });

  // Merge codes
  additionalElm.library.codes?.def.forEach(code => {
    if (!elm.library.codes?.def.find(def => def.name === code.name))
      elm.library.codes?.def.push(code);
  });

  // Merge codesystems
  additionalElm.library.codeSystems?.def.forEach(codesystem => {
    if (!elm.library.codeSystems?.def.find(def => def.name === codesystem.name))
      elm.library.codeSystems?.def.push(codesystem);
  });

  // TODO: merge concepts
}

function getElmStatement(elm: ElmLibrary): ElmStatement {
  const defaultStatementNames = [
    'Patient',
    'MeetsInclusionCriteria',
    'InPopulation',
    'Recommendation',
    'Rationale',
    'Errors'
  ];
  const elmStatement = elm.library.statements.def.find(
    def => !defaultStatementNames.includes(def.name)
  );

  // elmStatement type is ElmStatement | undefined but criteria
  // provider validates such a statement exists in the elm
  return elmStatement as ElmStatement;
}

// TODO: possibly add more precondition methods
export function addPrecondition(
  pathway: Pathway,
  id: string,
  elementName: string,
  expected: string,
  cql: string
): Pathway {
  const precondition: Precondition = {
    id: id,
    elementName: elementName,
    expected: expected,
    cql: cql
  };
  return produce(pathway, (draftPathway: Pathway) => {
    draftPathway.preconditions.push(precondition);
  });
}

export function setNavigationalElm(pathway: Pathway, elm: ElmLibrary[]): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    if (!draftPathway.elm) draftPathway.elm = {};
    draftPathway.elm.navigational = {
      main: elm[0],
      libraries: elm.slice(1)
    };
  });
}

export function setPreconditionElm(pathway: Pathway, elm: object): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    if (!draftPathway.elm) draftPathway.elm = {};
    draftPathway.elm.preconditions = elm;
  });
}

export function createNode(key?: string): PathwayNode {
  if (!key) key = shortid.generate();
  const node: PathwayNode = {
    key,
    label: 'New Node',
    transitions: [],
    type: 'null'
  };

  return node;
}

export function addNode(pathway: Pathway, node: PathwayNode): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    draftPathway.nodes[node.key] = node;
  });
}

export function setNodeLabel(pathway: Pathway, key: string, label: string): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    draftPathway.nodes[key].label = label;
  });
}

export function setNodeReference(
  pathway: Pathway,
  key: string,
  referenceId: string,
  referenceLabel: string
): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    (draftPathway.nodes[key] as ReferenceNode).referenceId = referenceId;
    (draftPathway.nodes[key] as ReferenceNode).referenceLabel = referenceLabel;
  });
}

export function setNodeType(pathway: Pathway, nodeKey: string, nodeType: string): Pathway {
  let action: Action;
  let newPathway: Pathway;
  switch (nodeType) {
    case 'MedicationRequest':
      newPathway = makeNodeAction(pathway, nodeKey);
      action = {
        type: 'create',
        description: '',
        id: shortid.generate(),
        resource: {
          resourceType: nodeType,
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
      return setNodeAction(newPathway, nodeKey, action);
    case 'ServiceRequest':
      newPathway = makeNodeAction(pathway, nodeKey);
      action = {
        type: 'create',
        description: '',
        id: shortid.generate(),
        resource: {
          resourceType: nodeType,
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
      return setNodeAction(newPathway, nodeKey, action);
    case 'CarePlan':
      newPathway = makeNodeAction(pathway, nodeKey);
      action = {
        type: 'create',
        description: '',
        id: shortid.generate(),
        resource: {
          resourceType: nodeType,
          title: ''
        }
      };
      return setNodeAction(newPathway, nodeKey, action);
    case 'Observation':
      return makeNodeBranch(pathway, nodeKey);
    case 'Reference':
      return makeNodeReference(pathway, nodeKey);
    default:
      console.error('Unknown nodeType: ' + nodeType);
      return pathway;
  }
}

export function setNodeAction(pathway: Pathway, key: string, action: Action): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    (draftPathway.nodes[key] as ActionNode).action = action;
  });
}

export function setNodeMcodeCriteria(
  pathway: Pathway,
  key: string,
  mcodeCriteria: string
): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    (draftPathway.nodes[key] as BranchNode).mcodeCriteria = mcodeCriteria;
  });
}

export function setNodeOtherCriteria(
  pathway: Pathway,
  key: string,
  otherCriteria: string
): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    (draftPathway.nodes[key] as BranchNode).otherCriteria = otherCriteria;
  });
}

export function addTransition(pathway: Pathway, startNodeKey: string, endNodeKey: string): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    const transition: Transition = {
      id: shortid.generate(),
      transition: endNodeKey
    };

    draftPathway.nodes[startNodeKey].transitions.push(transition);
  });
}

export function setTransitionCondition(
  pathway: Pathway,
  startNodeKey: string,
  transitionId: string,
  description: string,
  criteria: Criteria
): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    const foundTransition = draftPathway.nodes[startNodeKey]?.transitions?.find(
      (transition: Transition) => transition.id === transitionId
    );

    if (foundTransition) {
      foundTransition.condition = {
        description: description,
        cql: criteria.statement,
        elm: criteria.elm,
        criteriaSource: criteria.id
      };
    }
  });
}

/*
Set Element Functions
*/
export function setPathwayName(pathway: Pathway, name: string): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    draftPathway.name = name;
  });
}

export function setPathwayDescription(pathway: Pathway, description: string): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    draftPathway.description = description;
  });
}

export function setLibrary(pathway: Pathway, library: string): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    draftPathway.library = [library];
  });
}

export function setTransition(
  pathway: Pathway,
  startNodeKey: string,
  endNodeKey: string,
  transitionId: string
): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    const transition = draftPathway.nodes[startNodeKey]?.transitions?.find(
      (transition: Transition) => transition.id === transitionId
    );
    if (transition) transition.transition = endNodeKey;
  });
}

export function setTransitionConditionDescription(
  pathway: Pathway,
  startNodeKey: string,
  transitionId: string,
  description: string
): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    const foundTransition = draftPathway.nodes[startNodeKey]?.transitions?.find(
      (transition: Transition) => transition.id === transitionId
    );

    if (foundTransition?.condition) {
      foundTransition.condition.description = description;
    } else if (foundTransition) {
      foundTransition.condition = {
        description: description,
        criteriaSource: '',
        cql: ''
      };
    }
  });
}

export function setActionCode(action: Action, code: string): Action {
  return produce(action, (draftAction: Action) => {
    if (draftAction.resource.medicationCodeableConcept) {
      draftAction.resource.medicationCodeableConcept.coding[0].code = code;
    } else {
      draftAction.resource.code.coding[0].code = code;
    }
  });
}

export function setActionCodeSystem(action: Action, codeSystem: string): Action {
  return produce(action, (draftAction: Action) => {
    if (draftAction.resource.medicationCodeableConcept) {
      draftAction.resource.medicationCodeableConcept.coding[0].system = codeSystem;
    } else {
      draftAction.resource.code.coding[0].system = codeSystem;
    }
  });
}

export function setActionDescription(action: Action, description: string): Action {
  return produce(action, (draftaction: Action) => {
    draftaction.description = description;
  });
}

export function setActionTitle(action: Action, title: string): Action {
  return produce(action, (draftaction: Action) => {
    draftaction.resource.title = title;
  });
}

export function setActionResourceDisplay(action: Action, display: string): Action {
  return produce(action, (draftAction: Action) => {
    if (draftAction.resource.medicationCodeableConcept) {
      draftAction.resource.medicationCodeableConcept.coding[0].display = display;
    } else if (draftAction.resource.title) {
      draftAction.resource.description = display;
    } else {
      draftAction.resource.code.coding[0].display = display;
    }
  });
}

export function makeNodeAction(pathway: Pathway, nodeKey: string): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    const node = draftPathway.nodes[nodeKey] as ActionNode;
    node.type = 'action';

    node.transitions.forEach(transition => {
      delete transition.condition;
    });
  });
}

export function makeNodeBranch(pathway: Pathway, nodeKey: string): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    const node = draftPathway.nodes[nodeKey];
    const newNode: PathwayNode = {
      key: node.key,
      label: node.label,
      transitions: node.transitions,
      type: 'branch'
    };

    draftPathway.nodes[nodeKey] = newNode;
  });
}

export function makeNodeReference(pathway: Pathway, nodeKey: string): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    const node = draftPathway.nodes[nodeKey] as ActionNode;
    const newNode: ReferenceNode = {
      key: node.key,
      label: node.label,
      transitions: node.transitions,
      referenceId: '',
      referenceLabel: '',
      type: 'reference'
    };
    draftPathway.nodes[nodeKey] = newNode;
  });
}

export function createCQL(action: Action, nodeKey: string): ActionCqlLibrary {
  const resource = action.resource;
  // CQl identifier cannot start with a number or contain '-'
  const cqlId = `cql${shortid.generate().replace(/-/g, 'a')}`;
  let cql = `library ${cqlId} version '1'\nusing FHIR version '4.0.1'\n`;

  const codesystemStatement = (system: string): string => `codesystem "${system}": '${system}'\n`;

  const returnStatement = (resourceType: string): string =>
    `return Tuple{ resourceType: '${resourceType}', id: R.id.value, status: R.status.value}`;

  const retrieveStatement = (resourceType: string): string => `[${resourceType}: "${cqlId} code"]`;

  const defineStatement = (): string => `define "${nodeKey}":`;

  if (resource.resourceType === 'MedicationRequest') {
    const coding = resource.medicationCodeableConcept.coding[0];

    cql += codesystemStatement(coding.system);

    // eslint-disable-next-line
    cql += `code "${cqlId} code": '${escape(coding.code)}' from "${coding.system}" display '${
      coding.display
    }'\n`;
    cql += `${defineStatement()}
      ${retrieveStatement('MedicationRequest')} R ${returnStatement('MedicationRequest')}`;
  } else if (resource.resourceType === 'ServiceRequest') {
    const coding = resource.code.coding[0];

    cql += codesystemStatement(coding.system);

    // eslint-disable-next-line
    cql += `code "${cqlId} code": '${escape(coding.code)}' from "${coding.system}" display '${
      coding.display
    }'\n`;
    cql += `${defineStatement()}
      if exists ${retrieveStatement('Procedure')}
      then ${retrieveStatement('Procedure')} R ${returnStatement('Procedure')}
      else ${retrieveStatement('ServiceRequest')} R ${returnStatement('ServiceRequest')}`;
  } else if (resource.resourceType === 'CarePlan') {
    cql += `${defineStatement()}
      [CarePlan] R where R.title.value = '${escape(resource.title)}' ${returnStatement(
      'CarePlan'
    )}`;
  } else {
    console.error(
      'Auto generating CQL for action - unsupported resource type: ' + resource.resourceType
    );
  }

  return {
    name: cqlId,
    version: '1',
    cql: cql,
    nodeKey: nodeKey
  };
}

/*
Remove Element Functions
*/
export function removePrecondition(pathway: Pathway, id: string): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    const preconditions = draftPathway.preconditions.filter(
      (precondition: Precondition) => precondition.id !== id
    );
    draftPathway.preconditions = preconditions;
  });
}

export function removeNavigationalElm(pathway: Pathway): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    delete draftPathway.elm?.navigational;
  });
}

export function removePreconditionElm(pathway: Pathway): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    delete draftPathway.elm?.preconditions;
  });
}

export function removeNode(pathway: Pathway, key: string): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    delete draftPathway.nodes[key];

    Object.keys(draftPathway.nodes).forEach((nodeKey: string) => {
      const node = draftPathway.nodes[nodeKey];
      node.transitions.forEach((transition: Transition) => {
        if (transition.transition === key)
          draftPathway.nodes[nodeKey].transitions = draftPathway.nodes[nodeKey].transitions.filter(
            (filterTransition: Transition) => transition.id !== filterTransition.id
          );
      });
    });
  });
}

export function removeTransitionCondition(
  pathway: Pathway,
  nodeKey: string,
  transitionId: string
): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    const transition = draftPathway.nodes[nodeKey].transitions.find(
      (transition: Transition) => transition.id === transitionId
    );
    if (transition) delete transition.condition;
  });
}

export function removeTransition(
  pathway: Pathway,
  parentNodeKey: string,
  childNodeKey: string
): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    const transitions = draftPathway.nodes[parentNodeKey].transitions.filter(
      (transition: Transition) => transition.transition !== childNodeKey
    );
    draftPathway.nodes[parentNodeKey].transitions = transitions;
  });
}
