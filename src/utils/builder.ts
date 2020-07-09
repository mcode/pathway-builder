import { Pathway, Criteria, State, Transition, Action, GuidanceState } from 'pathways-model';
import { ElmLibrary, ElmStatement } from 'elm-model';
import shortid from 'shortid';
import { MedicationRequest, ServiceRequest } from 'fhir-objects';

export function createNewPathway(name: string, description?: string, pathwayId?: string): Pathway {
  return {
    id: pathwayId ?? shortid.generate(),
    name: name,
    description: description ?? '',
    library: '',
    criteria: [],
    states: {
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
    // Strip id from each criteria
    criteria: pathway.criteria.map((criteria: Criteria) => ({ ...criteria, id: undefined })),
    states: { ...pathway.states }
  };

  Object.keys(pathwayToExport.states).forEach((stateName: string) => {
    const state = pathway.states[stateName];
    if ('elm' in state && state.elm && state.key) {
      mergeElm(elm, state.elm);
      const elmStatement = getElmStatement(state.elm);
      elmStatement.name = state.key;
      elm.library.statements.def.push(elmStatement);
    }

    pathwayToExport.states[stateName] = {
      ...pathwayToExport.states[stateName],
      // Strip key from each state
      key: undefined,
      elm: undefined,
      // Strip id from each state.transition
      transitions: state.transitions.map((transition: Transition) => {
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
      // Strip id from each state.action
      action:
        (state as GuidanceState).action == null
          ? undefined
          : (state as GuidanceState).action.map((action: Action) => ({
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

// TODO: possibly add more criteria methods
export function addCriteria(
  pathway: Pathway,
  elementName: string,
  expected: string,
  cql: string
): string {
  const id = shortid.generate();
  const criteria: Criteria = {
    id: id,
    elementName: elementName,
    expected: expected,
    cql: cql
  };
  pathway.criteria.push(criteria);

  return id;
}

export function setNavigationalElm(pathway: Pathway, elm: object): void {
  if (!pathway.elm) pathway.elm = {};
  pathway.elm.navigational = elm;
}

export function setCriteriaElm(pathway: Pathway, elm: object): void {
  if (!pathway.elm) pathway.elm = {};
  pathway.elm.criteria = elm;
}

export function createState(key?: string): State {
  if (!key) key = shortid.generate();
  const state: State = {
    key,
    label: 'New Node',
    transitions: [],
    nodeTypeIsUndefined: true
  };

  return state;
}

export function addState(pathway: Pathway, state: State): Pathway {
  return {
    ...pathway,
    states: {
      ...pathway.states,
      [state.key as string]: state
    }
  };
}

export function addGuidanceState(pathway: Pathway): Pathway {
  const state = createState();
  const newPathway = addState(pathway, state);

  return makeStateGuidance(newPathway, state.key as string);
}

export function setStateLabel(pathway: Pathway, key: string, label: string): Pathway {
  return {
    ...pathway,
    states: {
      ...pathway.states,
      [key]: {
        ...pathway.states[key],
        label
      }
    }
  };
}

export function setStateNodeType(pathway: Pathway, stateKey: string, nodeType: string): Pathway {
  switch (nodeType) {
    case 'action':
      return makeStateGuidance(pathway, stateKey);
    case 'branch':
      return makeStateBranch(pathway, stateKey);
    default:
      return pathway;
  }
}

export function setStateCriteriaSource(
  pathway: Pathway,
  key: string,
  criteriaSource: string
): Pathway {
  return {
    ...pathway,
    states: {
      ...pathway.states,
      [key]: {
        ...pathway.states[key],
        criteriaSource
      }
    }
  };
}

export function setStateAction(pathway: Pathway, key: string, action: Action[]): Pathway {
  return {
    ...pathway,
    states: {
      ...pathway.states,
      [key]: {
        ...pathway.states[key],
        action
      }
    }
  };
}

export function setStateMcodeCriteria(
  pathway: Pathway,
  key: string,
  mcodeCriteria: string
): Pathway {
  return {
    ...pathway,
    states: {
      ...pathway.states,
      [key]: {
        ...pathway.states[key],
        mcodeCriteria
      }
    }
  };
}

export function setStateOtherCriteria(
  pathway: Pathway,
  key: string,
  otherCriteria: string
): Pathway {
  return {
    ...pathway,
    states: {
      ...pathway.states,
      [key]: {
        ...pathway.states[key],
        otherCriteria
      }
    }
  };
}

export function addTransition(
  pathway: Pathway,
  startStateKey: string,
  endStateKey: string
): Pathway {
  const transition: Transition = {
    id: shortid.generate(),
    transition: endStateKey
  };

  return {
    ...pathway,
    states: {
      ...pathway.states,
      [startStateKey]: {
        ...pathway.states[startStateKey],
        transitions: [...pathway.states[startStateKey].transitions, transition]
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
  criteriaLabel?: string
): Pathway {
  const foundTransition = pathway.states[startNodeKey]?.transitions?.find(
    (transition: Transition) => transition.id === transitionId
  );

  const cql = criteriaLabel ? criteriaLabel : getElmStatement(elm).name;

  if (foundTransition)
    foundTransition.condition = {
      description: description,
      cql: cql,
      elm: elm
    };

  return {
    ...pathway,
    states: {
      ...pathway.states,
      [startNodeKey]: {
        ...pathway.states[startNodeKey]
      }
    }
  };
}

export function setGuidanceStateElm(pathway: Pathway, stateKey: string, elm: ElmLibrary): Pathway {
  return {
    ...pathway,
    states: {
      ...pathway.states,
      [stateKey]: {
        ...pathway.states[stateKey],
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
  (pathway.states[key] as GuidanceState).action.push(action);
  return id;
}

export function getNodeType(pathway: Pathway, key: string | undefined): string {
  if (!key) {
    return 'null';
  }
  const state = pathway.states[key];
  if (state.nodeTypeIsUndefined) {
    return 'null';
  } else if (!(state as GuidanceState).action && key !== 'Start') {
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
  startStateKey: string,
  endStateKey: string,
  transitionId: string
): void {
  const transition = pathway.states[startStateKey]?.transitions?.find(
    (transition: Transition) => transition.id === transitionId
  );
  if (transition) transition.transition = endStateKey;
}

export function setTransitionConditionDescription(
  pathway: Pathway,
  startNodeKey: string,
  transitionId: string,
  description: string
): Pathway {
  const foundTransition = pathway.states[startNodeKey]?.transitions?.find(
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
    states: {
      ...pathway.states,
      [startNodeKey]: {
        ...pathway.states[startNodeKey]
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
  const foundTransition = pathway.states[startNodeKey]?.transitions?.find(
    (transition: Transition) => transition.id === transitionId
  );

  if (foundTransition?.condition) {
    foundTransition.condition.elm = elm;
    foundTransition.condition.cql = getElmStatement(elm).name;
  }
}

export function setActionType(
  pathway: Pathway,
  stateKey: string,
  actionId: string,
  type: string
): void {
  if ((pathway.states[stateKey] as GuidanceState).action) {
    const action = (pathway.states[stateKey] as GuidanceState).action.find(
      (action: Action) => action.id === actionId
    );
    if (action) action.type = type;
  }
}

export function setActionDescription(
  pathway: Pathway,
  stateKey: string,
  actionId: string,
  description: string
): void {
  const state = (pathway.states[stateKey] as GuidanceState).action;

  if (state) {
    const action = state.find((action: Action) => action.id === actionId);
    if (action) {
      action.description = description;
    }
  }
}

export function setActionResource(
  pathway: Pathway,
  stateKey: string,
  actionId: string,
  resource: MedicationRequest | ServiceRequest
): void {
  if ((pathway.states[stateKey] as GuidanceState).action) {
    const action = (pathway.states[stateKey] as GuidanceState).action.find(
      (action: Action) => action.id === actionId
    );
    if (action) action.resource = resource;
  }
}

export function setActionResourceDisplay(
  pathway: Pathway,
  stateKey: string,
  actionId: string,
  display: string
): void {
  if ((pathway.states[stateKey] as GuidanceState).action) {
    const action = (pathway.states[stateKey] as GuidanceState).action.find(
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

export function makeStateGuidance(pathway: Pathway, stateKey: string): Pathway {
  const state = pathway.states[stateKey] as GuidanceState;

  if (state.cql !== undefined && state.action !== undefined) {
    return pathway;
  }

  return {
    ...pathway,
    states: {
      ...pathway.states,
      [stateKey]: {
        ...state,
        cql: '',
        action: [],
        nodeTypeIsUndefined: undefined
      }
    }
  };
}

export function makeStateBranch(pathway: Pathway, stateKey: string): Pathway {
  const state = pathway.states[stateKey] as GuidanceState;

  if (
    state.cql === undefined &&
    state.elm === undefined &&
    state.action === undefined &&
    state.nodeTypeIsUndefined === undefined
  ) {
    return pathway;
  }

  return {
    ...pathway,
    states: {
      ...pathway.states,
      [stateKey]: {
        ...state,
        cql: undefined,
        elm: undefined,
        action: undefined,
        nodeTypeIsUndefined: undefined
      }
    }
  };
}

export function createCQL(action: Action, stateKey: string): string {
  const resource = action.resource;
  // CQl identifier cannot start with a number or contain '-'
  const cqlId = `cql${shortid.generate().replace(/-/g, 'a')}`;
  let cql = `library ${cqlId} version '1'\nusing FHIR version '4.0.0'\n`;

  const codesystemStatement = (system: string): string => `codesystem "${system}": '${system}'\n`;

  const returnStatement = (resourceType: string): string =>
    `return Tuple{ resourceType: '${resourceType}', id: R.id.value, status: R.status.value}`;

  const retrieveStatement = (resourceType: string): string => `[${resourceType}: "${cqlId} code"]`;

  const defineStatement = (): string => `define "${stateKey}":`;

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

export function removeCriteria(pathway: Pathway, id: string): void {
  const criteria = pathway.criteria.filter((criteria: Criteria) => criteria.id !== id);
  pathway.criteria = criteria;
}

export function removeNavigationalElm(pathway: Pathway): void {
  delete pathway.elm?.navigational;
}

export function removeCriteriaElm(pathway: Pathway): void {
  delete pathway.elm?.criteria;
}

export function removeState(pathway: Pathway, key: string): void {
  delete pathway.states[key];

  Object.keys(pathway.states).forEach((stateName: string) => {
    const state = pathway.states[stateName];
    state.transitions.forEach((transition: Transition) => {
      if (transition.transition === key)
        removeTransition(pathway, stateName, transition.id ?? '-1');
    });
  });
}

export function removeTransitionCondition(
  pathway: Pathway,
  stateKey: string,
  transitionId: string
): Pathway {
  const transition = pathway.states[stateKey].transitions.find(
    (transition: Transition) => transition.id === transitionId
  );
  if (transition) delete transition.condition;

  return {
    ...pathway,
    states: {
      ...pathway.states,
      [stateKey]: {
        ...pathway.states[stateKey]
      }
    }
  };
}

export function removeTransition(pathway: Pathway, stateKey: string, transitionId: string): void {
  const transitions = pathway.states[stateKey].transitions.filter(
    (transition: Transition) => transition.id !== transitionId
  );
  pathway.states[stateKey].transitions = transitions;
}

export function removeAction(pathway: Pathway, stateKey: string, actionId: string): void {
  if ((pathway.states[stateKey] as GuidanceState).action) {
    const actions = (pathway.states[stateKey] as GuidanceState).action.filter(
      (action: Action) => action.id !== actionId
    );
    (pathway.states[stateKey] as GuidanceState).action = actions;
  }
}
