import {
  Pathway,
  Precondition,
  PathwayNode,
  Transition,
  Action,
  ActionNode,
  BranchNode
} from 'pathways-model';
import { ElmLibrary, ElmStatement } from 'elm-model';
import shortid from 'shortid';
import { MedicationRequest, ServiceRequest } from 'fhir-objects';
import produce from 'immer';
import { toCPG } from './cpg';

export function createNewPathway(name: string, description?: string, pathwayId?: string): Pathway {
  return {
    id: pathwayId ?? shortid.generate(),
    name: name,
    description: description ?? '',
    library: '',
    preconditions: [],
    nodes: {
      Start: {
        key: 'Start',
        label: 'Start',
        transitions: []
      }
    }
  };
}

export function downloadPathway(pathway: Pathway, cpg = false): void {
  const pathwayString = exportPathway(pathway, cpg);
  // Create blob from pathwayString to save to file system
  const pathwayBlob = new Blob([pathwayString], {
    type: 'application/json'
  });
  // Temporarily create hidden <a> tag to download pathwayBlob
  // File name is set to <pathway-name>.json
  const url = window.URL.createObjectURL(pathwayBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${pathway.name}.json`;
  a.click();
  window.URL.revokeObjectURL(url);
}

export function exportPathway(pathway: Pathway, cpg: boolean): string {
  if (cpg) return JSON.stringify(toCPG(pathway), undefined, 2);

  const elm: ElmLibrary = {
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

  const pathwayToExport: Pathway = {
    ...pathway,
    // Strip id from each precondition
    preconditions: pathway.preconditions.map((precondition: Precondition) => ({
      ...precondition,
      id: undefined
    })),
    nodes: { ...pathway.nodes }
  };

  Object.keys(pathwayToExport.nodes).forEach((nodeKey: string) => {
    const node = pathway.nodes[nodeKey];
    if ('elm' in node && node.elm && node.key) {
      mergeElm(elm, node.elm);
      const elmStatement = produce(getElmStatement(node.elm), (draftElmStatement: ElmStatement) => {
        // state.key is defined due to if statement above
        // eslint-disable-next-line
        draftElmStatement.name = node.key!;
      });
      elm.library.statements.def.push(elmStatement);
    }

    pathwayToExport.nodes[nodeKey] = {
      ...pathwayToExport.nodes[nodeKey],
      // Strip key from each node
      key: undefined,
      elm: undefined,
      // Strip id from each node.transition
      transitions: node.transitions.map((transition: Transition) => {
        if (transition.condition?.elm) {
          // Add tranistion.condition.elm to elm
          mergeElm(elm, transition.condition.elm);
          const elmStatement = produce(
            getElmStatement(transition.condition.elm),
            (draftElmStatement: ElmStatement) => {
              draftElmStatement.name = transition.condition?.description ?? 'Unknown';
            }
          );
          elm.library.statements.def.push(elmStatement);
        }
        return {
          ...transition,
          id: undefined,
          condition: transition.condition ? { ...transition.condition, elm: undefined } : undefined
        };
      }),
      // Strip id from each node.action
      action:
        (node as ActionNode).action == null
          ? undefined
          : (node as ActionNode).action.map((action: Action) => ({
              ...action,
              id: undefined
            }))
    };
  });

  return JSON.stringify(setNavigationalElm(pathwayToExport, elm), undefined, 2);
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
  elementName: string,
  expected: string,
  cql: string
): string {
  const id = shortid.generate();
  const precondition: Precondition = {
    id: id,
    elementName: elementName,
    expected: expected,
    cql: cql
  };
  pathway.preconditions.push(precondition);

  return id;
}

export function setNavigationalElm(pathway: Pathway, elm: object): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    if (!draftPathway.elm) draftPathway.elm = {};
    draftPathway.elm.navigational = elm;
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
    nodeTypeIsUndefined: true
  };

  return node;
}

export function addNode(pathway: Pathway, node: PathwayNode): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    draftPathway.nodes[node.key as string] = node;
  });
}

export function addActionNode(pathway: Pathway): Pathway {
  const node = createNode();
  const newPathway = addNode(pathway, node);

  return makeNodeAction(newPathway, node.key as string);
}

export function setNodeLabel(pathway: Pathway, key: string, label: string): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    draftPathway.nodes[key].label = label;
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
      return setNodeAction(newPathway, nodeKey, [action]);
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
      return setNodeAction(newPathway, nodeKey, [action]);
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
      return setNodeAction(newPathway, nodeKey, [action]);
    case 'Observation':
      return makeNodeBranch(pathway, nodeKey);
    default:
      console.error('Unknown nodeType: ' + nodeType);
      return pathway;
  }
}

export function setNodeCriteriaSource(
  pathway: Pathway,
  key: string,
  criteriaSource: string
): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    (draftPathway.nodes[key] as BranchNode).criteriaSource = criteriaSource;
  });
}

export function setNodeAction(pathway: Pathway, key: string, action: Action[]): Pathway {
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
  elm: ElmLibrary,
  criteriaLabel?: string
): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    const foundTransition = draftPathway.nodes[startNodeKey]?.transitions?.find(
      (transition: Transition) => transition.id === transitionId
    );

    const cql = criteriaLabel ? criteriaLabel : getElmStatement(elm).name;

    if (foundTransition)
      foundTransition.condition = {
        description: description,
        cql: cql,
        elm: elm
      };
  });
}

export function setActionNodeElm(pathway: Pathway, nodeKey: string, elm: ElmLibrary): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    (draftPathway.nodes[nodeKey] as ActionNode).elm = elm;
    (draftPathway.nodes[nodeKey] as ActionNode).cql = getElmStatement(elm).name;
  });
}

// TODO: possibly add more action methods
export function addAction(
  pathway: Pathway,
  key: string,
  type: string,
  description: string,
  resource: MedicationRequest | ServiceRequest
): string {
  const id = shortid.generate();
  const action = {
    id: id,
    type: type,
    description: description,
    resource: resource
  };

  const node = produce(pathway.nodes[key] as ActionNode, (draftState: ActionNode) => {
    draftState.action.push(action);
  });
  pathway.nodes[key] = node;

  return id;
}

export function getNodeType(pathway: Pathway, key: string | undefined): string {
  if (!key) {
    return 'null';
  }
  const node = pathway.nodes[key];
  if (!node || node.nodeTypeIsUndefined) {
    return 'null';
  } else if (!(node as ActionNode).action && key !== 'Start') {
    return 'branch';
  } else {
    return 'action';
  }
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
    draftPathway.library = library;
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
        cql: ''
      };
    }
  });
}

export function setTransitionConditionElm(
  pathway: Pathway,
  startNodeKey: string,
  transitionId: string,
  elm: ElmLibrary
): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    const foundTransition = draftPathway.nodes[startNodeKey]?.transitions?.find(
      (transition: Transition) => transition.id === transitionId
    );

    if (foundTransition?.condition) {
      foundTransition.condition.elm = elm;
      foundTransition.condition.cql = getElmStatement(elm).name;
    }
  });
}

export function setActionType(
  pathway: Pathway,
  nodeKey: string,
  actionId: string,
  type: string
): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    if ((draftPathway.nodes[nodeKey] as ActionNode).action) {
      const action = (draftPathway.nodes[nodeKey] as ActionNode).action.find(
        (action: Action) => action.id === actionId
      );
      if (action) action.type = type;
    }
  });
}

export function setActionDescription(
  pathway: Pathway,
  nodeKey: string,
  actionId: string,
  description: string
): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    const node = (draftPathway.nodes[nodeKey] as ActionNode).action;

    if (node) {
      const action = node.find((action: Action) => action.id === actionId);
      if (action) {
        action.description = description;
      }
    }
  });
}

export function setActionResource(
  pathway: Pathway,
  nodeKey: string,
  actionId: string,
  resource: MedicationRequest | ServiceRequest
): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    if ((draftPathway.nodes[nodeKey] as ActionNode).action) {
      const action = (draftPathway.nodes[nodeKey] as ActionNode).action.find(
        (action: Action) => action.id === actionId
      );
      if (action) action.resource = resource;
    }
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

    if (node.cql === undefined && node.action === undefined) {
      node.cql = '';
      node.action = [];
      node.nodeTypeIsUndefined = undefined;
    }

    node.transitions.forEach(transition => {
      delete transition.condition;
    });
  });
}

export function makeNodeBranch(pathway: Pathway, nodeKey: string): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    const node = draftPathway.nodes[nodeKey] as ActionNode;

    if (
      node.cql !== undefined ||
      node.elm !== undefined ||
      node.action !== undefined ||
      node.nodeTypeIsUndefined !== undefined
    ) {
      delete node.cql;
      delete node.elm;
      delete node.action;
      delete node.nodeTypeIsUndefined;
    }
  });
}

export function createCQL(action: Action, nodeKey: string): string {
  const resource = action.resource;
  // CQl identifier cannot start with a number or contain '-'
  const cqlId = `cql${shortid.generate().replace(/-/g, 'a')}`;
  let cql = `library ${cqlId} version '1'\nusing FHIR version '4.0.0'\n`;

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

  return cql;
}

/*
Remove Element Function
*/
export function removePathwayDescription(pathway: Pathway): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    delete draftPathway.description;
  });
}

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

export function removeAction(pathway: Pathway, nodeKey: string, actionId: string): Pathway {
  return produce(pathway, (draftPathway: Pathway) => {
    if ((draftPathway.nodes[nodeKey] as ActionNode).action) {
      const actions = (draftPathway.nodes[nodeKey] as ActionNode).action.filter(
        (action: Action) => action.id !== actionId
      );
      (draftPathway.nodes[nodeKey] as ActionNode).action = actions;
    }
  });
}
