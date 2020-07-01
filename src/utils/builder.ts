import {
  Pathway,
  Precondition,
  PathwayNode,
  Transition,
  Action,
  PathwayActionNode
} from 'pathways-model';
import { ElmLibrary, ElmStatement } from 'elm-model';
import shortid from 'shortid';
import { MedicationRequest, ServiceRequest } from 'fhir-objects';

export function createNewPathway(name: string, description?: string, pathwayId?: string): Pathway {
  return {
    id: pathwayId ?? shortid.generate(),
    name: name,
    description: description ?? '',
    library: '',
    precondition: [],
    nodes: {
      Start: {
        key: 'Start',
        label: 'Start',
        transitions: []
      }
    }
  };
}

export function downloadPathway(pathway: Pathway): void {
  const pathwayString = exportPathway(pathway);
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

export function exportPathway(pathway: Pathway): string {
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
    precondition: pathway.precondition.map((precondition: Precondition) => ({
      ...precondition,
      id: undefined
    })),
    nodes: { ...pathway.nodes }
  };

  Object.keys(pathwayToExport.nodes).forEach((nodeKey: string) => {
    const node = pathway.nodes[nodeKey];
    if ('elm' in node && node.elm && node.key) {
      mergeElm(elm, node.elm);
      const elmStatement = getElmStatement(node.elm);
      elmStatement.name = node.key;
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
          const elmStatement = getElmStatement(transition.condition.elm);
          elmStatement.name = transition.condition.description;
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
        (node as PathwayActionNode).action == null
          ? undefined
          : (node as PathwayActionNode).action.map((action: Action) => ({
              ...action,
              id: undefined
            }))
    };
  });

  setNavigationalElm(pathwayToExport, elm);

  return JSON.stringify(pathwayToExport, undefined, 2);
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
    'MeetsInclusionPrecondition',
    'InPopulation',
    'Recommendation',
    'Rationale',
    'Errors'
  ];
  const elmStatement = elm.library.statements.def.find(
    def => !defaultStatementNames.includes(def.name)
  );

  // elmStatement type is ElmStatement | undefined but precondition
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
  pathway.precondition.push(precondition);

  return id;
}

export function setNavigationalElm(pathway: Pathway, elm: object): void {
  if (!pathway.elm) pathway.elm = {};
  pathway.elm.navigational = elm;
}

export function setPreconditionElm(pathway: Pathway, elm: object): void {
  if (!pathway.elm) pathway.elm = {};
  pathway.elm.precondition = elm;
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
  return {
    ...pathway,
    nodes: {
      ...pathway.nodes,
      [node.key as string]: node
    }
  };
}

export function addActionNode(pathway: Pathway): Pathway {
  const node = createNode();
  const newPathway = addNode(pathway, node);

  return makeNodeAction(newPathway, node.key as string);
}

export function setNodeLabel(pathway: Pathway, key: string, label: string): Pathway {
  return {
    ...pathway,
    nodes: {
      ...pathway.nodes,
      [key]: {
        ...pathway.nodes[key],
        label
      }
    }
  };
}

export function setNodeNodeType(pathway: Pathway, nodeKey: string, nodeType: string): Pathway {
  switch (nodeType) {
    case 'action':
      return makeNodeAction(pathway, nodeKey);
    case 'branch':
      return makeNodeBranch(pathway, nodeKey);
    default:
      return pathway;
  }
}

export function setNodePreconditionSource(
  pathway: Pathway,
  key: string,
  preconditionSource: string
): Pathway {
  return {
    ...pathway,
    nodes: {
      ...pathway.nodes,
      [key]: {
        ...pathway.nodes[key],
        preconditionSource
      }
    }
  };
}

export function setNodeAction(pathway: Pathway, key: string, action: Action[]): Pathway {
  return {
    ...pathway,
    nodes: {
      ...pathway.nodes,
      [key]: {
        ...pathway.nodes[key],
        action
      }
    }
  };
}

export function setNodeMcodePrecondition(
  pathway: Pathway,
  key: string,
  mcodePrecondition: string
): Pathway {
  return {
    ...pathway,
    nodes: {
      ...pathway.nodes,
      [key]: {
        ...pathway.nodes[key],
        mcodePrecondition
      }
    }
  };
}

export function setNodeOtherPrecondition(
  pathway: Pathway,
  key: string,
  otherPrecondition: string
): Pathway {
  return {
    ...pathway,
    nodes: {
      ...pathway.nodes,
      [key]: {
        ...pathway.nodes[key],
        otherPrecondition
      }
    }
  };
}

export function addTransition(pathway: Pathway, startNodeKey: string, endNodeKey: string): Pathway {
  const transition: Transition = {
    id: shortid.generate(),
    transition: endNodeKey
  };

  return {
    ...pathway,
    nodes: {
      ...pathway.nodes,
      [startNodeKey]: {
        ...pathway.nodes[startNodeKey],
        transitions: [...pathway.nodes[startNodeKey].transitions, transition]
      }
    }
  };
}

export function setTransitionCondition(
  pathway: Pathway,
  startNodeKey: string,
  transitionId: string,
  description: string,
  elm: ElmLibrary,
  preconditionLabel?: string
): Pathway {
  const foundTransition = pathway.nodes[startNodeKey]?.transitions?.find(
    (transition: Transition) => transition.id === transitionId
  );

  const cql = preconditionLabel ? preconditionLabel : getElmStatement(elm).name;

  if (foundTransition)
    foundTransition.condition = {
      description: description,
      cql: cql,
      elm: elm
    };

  return {
    ...pathway,
    nodes: {
      ...pathway.nodes,
      [startNodeKey]: {
        ...pathway.nodes[startNodeKey]
      }
    }
  };
}

export function setActionNodeElm(pathway: Pathway, nodeKey: string, elm: ElmLibrary): Pathway {
  return {
    ...pathway,
    nodes: {
      ...pathway.nodes,
      [nodeKey]: {
        ...pathway.nodes[nodeKey],
        elm: elm,
        cql: getElmStatement(elm).name
      }
    }
  };
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
  (pathway.nodes[key] as PathwayActionNode).action.push(action);
  return id;
}

export function getNodeType(pathway: Pathway, key: string | undefined): string {
  if (!key) {
    return 'null';
  }
  const node = pathway.nodes[key];
  if (node.nodeTypeIsUndefined) {
    return 'null';
  } else if (!(node as PathwayActionNode).action && key !== 'Start') {
    return 'branch';
  } else {
    return 'action';
  }
}

/*
Set Element Functions
*/
export function setPathwayName(pathway: Pathway, name: string): void {
  pathway.name = name;
}

export function setPathwayDescription(pathway: Pathway, description: string): void {
  pathway.description = description;
}

export function setLibrary(pathway: Pathway, library: string): void {
  pathway.library = library;
}

export function setTransition(
  pathway: Pathway,
  startNodeKey: string,
  endNodeKey: string,
  transitionId: string
): void {
  const transition = pathway.nodes[startNodeKey]?.transitions?.find(
    (transition: Transition) => transition.id === transitionId
  );
  if (transition) transition.transition = endNodeKey;
}

export function setTransitionConditionDescription(
  pathway: Pathway,
  startNodeKey: string,
  transitionId: string,
  description: string
): Pathway {
  const foundTransition = pathway.nodes[startNodeKey]?.transitions?.find(
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

  return {
    ...pathway,
    nodes: {
      ...pathway.nodes,
      [startNodeKey]: {
        ...pathway.nodes[startNodeKey]
      }
    }
  };
}

export function setTransitionConditionElm(
  pathway: Pathway,
  startNodeKey: string,
  transitionId: string,
  elm: ElmLibrary
): void {
  const foundTransition = pathway.nodes[startNodeKey]?.transitions?.find(
    (transition: Transition) => transition.id === transitionId
  );

  if (foundTransition?.condition) {
    foundTransition.condition.elm = elm;
    foundTransition.condition.cql = getElmStatement(elm).name;
  }
}

export function setActionType(
  pathway: Pathway,
  nodeKey: string,
  actionId: string,
  type: string
): void {
  if ((pathway.nodes[nodeKey] as PathwayActionNode).action) {
    const action = (pathway.nodes[nodeKey] as PathwayActionNode).action.find(
      (action: Action) => action.id === actionId
    );
    if (action) action.type = type;
  }
}

export function setActionDescription(
  pathway: Pathway,
  nodeKey: string,
  actionId: string,
  description: string
): void {
  const node = (pathway.nodes[nodeKey] as PathwayActionNode).action;

  if (node) {
    const action = node.find((action: Action) => action.id === actionId);
    if (action) {
      action.description = description;
    }
  }
}

export function setActionResource(
  pathway: Pathway,
  nodeKey: string,
  actionId: string,
  resource: MedicationRequest | ServiceRequest
): void {
  if ((pathway.nodes[nodeKey] as PathwayActionNode).action) {
    const action = (pathway.nodes[nodeKey] as PathwayActionNode).action.find(
      (action: Action) => action.id === actionId
    );
    if (action) action.resource = resource;
  }
}

export function setActionResourceDisplay(
  pathway: Pathway,
  nodeKey: string,
  actionId: string,
  display: string
): void {
  if ((pathway.nodes[nodeKey] as PathwayActionNode).action) {
    const action = (pathway.nodes[nodeKey] as PathwayActionNode).action.find(
      (action: Action) => action.id === actionId
    );
    const resource = action?.resource;
    if (
      resource?.resourceType === 'MedicationRequest' &&
      resource.medicationCodeableConcept.coding.length
    )
      resource.medicationCodeableConcept.coding[0].display = display;
    else if (resource?.resourceType === 'ServiceRequest' && resource.code.coding.length)
      resource.code.coding[0].display = display;
  }
}

export function makeNodeAction(pathway: Pathway, nodeKey: string): Pathway {
  const node = pathway.nodes[nodeKey] as PathwayActionNode;

  if (node.cql !== undefined && node.action !== undefined) {
    return pathway;
  }

  return {
    ...pathway,
    nodes: {
      ...pathway.nodes,
      [nodeKey]: {
        ...node,
        cql: '',
        action: [],
        nodeTypeIsUndefined: undefined
      }
    }
  };
}

export function makeNodeBranch(pathway: Pathway, nodeKey: string): Pathway {
  const node = pathway.nodes[nodeKey] as PathwayActionNode;

  if (
    node.cql === undefined &&
    node.elm === undefined &&
    node.action === undefined &&
    node.nodeTypeIsUndefined === undefined
  ) {
    return pathway;
  }

  return {
    ...pathway,
    nodes: {
      ...pathway.nodes,
      [nodeKey]: {
        ...node,
        cql: undefined,
        elm: undefined,
        action: undefined,
        nodeTypeIsUndefined: undefined
      }
    }
  };
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
export function removePathwayDescription(pathway: Pathway): void {
  delete pathway.description;
}

export function removePrecondition(pathway: Pathway, id: string): void {
  const precondition = pathway.precondition.filter(
    (precondition: Precondition) => precondition.id !== id
  );
  pathway.precondition = precondition;
}

export function removeNavigationalElm(pathway: Pathway): void {
  delete pathway.elm?.navigational;
}

export function removePreconditionElm(pathway: Pathway): void {
  delete pathway.elm?.precondition;
}

export function removeNode(pathway: Pathway, key: string): void {
  delete pathway.nodes[key];

  Object.keys(pathway.nodes).forEach((nodeKey: string) => {
    const node = pathway.nodes[nodeKey];
    node.transitions.forEach((transition: Transition) => {
      if (transition.transition === key) removeTransition(pathway, nodeKey, transition.id ?? '-1');
    });
  });
}

export function removeTransitionCondition(
  pathway: Pathway,
  nodeKey: string,
  transitionId: string
): Pathway {
  const transition = pathway.nodes[nodeKey].transitions.find(
    (transition: Transition) => transition.id === transitionId
  );
  if (transition) delete transition.condition;

  return {
    ...pathway,
    nodes: {
      ...pathway.nodes,
      [nodeKey]: {
        ...pathway.nodes[nodeKey]
      }
    }
  };
}

export function removeTransition(pathway: Pathway, nodeKey: string, transitionId: string): void {
  const transitions = pathway.nodes[nodeKey].transitions.filter(
    (transition: Transition) => transition.id !== transitionId
  );
  pathway.nodes[nodeKey].transitions = transitions;
}

export function removeAction(pathway: Pathway, nodeKey: string, actionId: string): void {
  if ((pathway.nodes[nodeKey] as PathwayActionNode).action) {
    const actions = (pathway.nodes[nodeKey] as PathwayActionNode).action.filter(
      (action: Action) => action.id !== actionId
    );
    (pathway.nodes[nodeKey] as PathwayActionNode).action = actions;
  }
}
