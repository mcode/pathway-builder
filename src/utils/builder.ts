import { Pathway, Criteria, State, GuidanceState, Transition, Action } from 'pathways-model';
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

export function exportPathway(pathway: Pathway): string {
  const pathwayToExport: Pathway = {
    ...pathway,
    // Strip id from each criteria
    criteria: pathway.criteria.map((criteria: Criteria) => ({ ...criteria, id: undefined })),
    states: { ...pathway.states }
  };

  Object.keys(pathwayToExport.states).forEach((stateName: string) => {
    pathwayToExport.states[stateName] = {
      ...pathwayToExport.states[stateName],
      // Strip key from each state
      key: undefined,
      criteriaSource: undefined,
      mcodeCriteria: undefined,
      otherCriteria: undefined,
      // Strip id from each state.transition
      transitions: pathway.states[stateName].transitions.map((transition: Transition) => ({
        ...transition,
        id: undefined
      })),
      // Strip id from each state.action
      action:
        (pathway.states[stateName] as GuidanceState).action == null
          ? undefined
          : (pathway.states[stateName] as GuidanceState).action.map((action: Action) => ({
              ...action,
              id: undefined
            }))
    };
  });

  return JSON.stringify(pathwayToExport, undefined, 2);
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
  cql: string
): void {
  const foundTransition = pathway.states[startNodeKey]?.transitions?.find(
    (transition: Transition) => transition.id === transitionId
  );

  if (foundTransition) foundTransition.condition = { description: description, cql: cql };
}

export function setGuidanceStateCql(pathway: Pathway, key: string, cql: string): void {
  (pathway.states[key] as GuidanceState).cql = cql;
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
): void {
  const foundTransition = pathway.states[startNodeKey]?.transitions?.find(
    (transition: Transition) => transition.id === transitionId
  );

  if (foundTransition?.condition) foundTransition.condition.description = description;
}

export function setTransitionConditionCql(
  pathway: Pathway,
  startNodeKey: string,
  transitionId: string,
  cql: string
): void {
  const foundTransition = pathway.states[startNodeKey]?.transitions?.find(
    (transition: Transition) => transition.id === transitionId
  );

  if (foundTransition?.condition) foundTransition.condition.cql = cql;
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
  if ((pathway.states[stateKey] as GuidanceState).action) {
    const action = (pathway.states[stateKey] as GuidanceState).action.find(
      (action: Action) => action.id === actionId
    );
    if (action) action.description = description;
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
        nodeTypeIsUndefined: undefined,
        criteriaSource: undefined,
        mcodeCriteria: undefined,
        otherCriteria: undefined
      }
    }
  };
}

export function makeStateBranch(pathway: Pathway, stateKey: string): Pathway {
  const state = pathway.states[stateKey] as GuidanceState;

  if (
    state.cql === undefined &&
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
        action: undefined,
        nodeTypeIsUndefined: undefined
      }
    }
  };
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
): void {
  const transition = pathway.states[stateKey].transitions.find(
    (transition: Transition) => transition.id === transitionId
  );
  if (transition) delete transition.condition;
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
