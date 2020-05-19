import { Pathway, Criteria, State, Transition, Action, GuidanceState } from 'pathways-model';
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
  // Strip id from each criteria
  pathway.criteria.forEach((criteria: Criteria) => delete criteria.id);

  // Strip key from each state
  Object.keys(pathway.states).forEach((stateName: string) => {
    const state = pathway.states[stateName];
    delete state.key;

    // Strip id from each state.transition
    state.transitions.forEach((transition: Transition) => delete transition.id);

    // Strip id from each state.action
    if ('action' in state) {
      (state as GuidanceState).action.forEach((action: Action) => delete action.id);
    }
  });

  return JSON.stringify(pathway, undefined, 2);
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

  return makeBranchStateGuidance(newPathway, state.key as string);
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

export function setStateNodeType(
  pathway: Pathway,
  key: string,
  nodeType: string,
  nodeTypeIsUndefined: boolean | undefined
): Pathway {
  return {
    ...pathway,
    states: {
      ...pathway.states,
      [key]: {
        ...pathway.states[key],
        nodeType,
        nodeTypeIsUndefined: nodeTypeIsUndefined
      }
    }
  };
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
  const foundTransition: Transition | null = pathway.states[startNodeKey].transitions.find(
    (transition: Transition) => transition.id === transitionId
  );

  if (foundTransition) foundTransition.condition = { description: description, cql: cql };
}

export function setGuidanceStateCql(pathway: Pathway, key: string, cql: string): void {
  pathway.states[key].cql = cql;
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
  pathway.states[key].action.push(action);
  return id;
}

export function getNodeType(pathway: Pathway, key: string | undefined): string {
  if (!key) {
    return 'null';
  }
  const state = pathway.states[key];
  if (state.nodeTypeIsUndefined) {
    return 'null';
  } else if (!state.action && key !== 'Start') {
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
  const transition: Transition = pathway.states[startStateKey].transitions.find(
    (transition: Transition) => transition.id === transitionId
  );
  transition.transition = endStateKey;
}

export function setTransitionConditionDescription(
  pathway: Pathway,
  startNodeKey: string,
  transitionId: string,
  description: string
): void {
  const foundTransition: Transition | null = pathway.states[startNodeKey].transitions.find(
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
  const foundTransition: Transition | null = pathway.states[startNodeKey].transitions.find(
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
  if (pathway.states[stateKey].action) {
    const action = pathway.states[stateKey].action.find((action: Action) => action.id === actionId);
    action.type = type;
  }
}

export function setActionDescription(
  pathway: Pathway,
  stateKey: string,
  actionId: string,
  description: string
): void {
  if (pathway.states[stateKey].action) {
    const action = pathway.states[stateKey].action.find((action: Action) => action.id === actionId);
    action.description = description;
  }
}

export function setActionResource(
  pathway: Pathway,
  stateKey: string,
  actionId: string,
  resource: MedicationRequest | ServiceRequest
): void {
  if (pathway.states[stateKey].action) {
    const action = pathway.states[stateKey].action.find((action: Action) => action.id === actionId);
    action.resource = resource;
  }
}

export function makeBranchStateGuidance(pathway: Pathway, key: string): Pathway {
  const state = pathway.states[key];
  delete pathway.states[key].nodeTypeIsUndefined;

  if (!state.action) {
    return {
      ...pathway,
      states: {
        ...pathway.states,
        [key]: {
          ...pathway.states[key],
          cql: '',
          action: []
        }
      }
    };
  }

  return { ...pathway };
}

export function makeGuidanceStateBranch(pathway: Pathway, key: string): Pathway {
  delete pathway.states[key].cql;
  delete pathway.states[key].action;
  delete pathway.states[key].nodeTypeIsUndefined;

  return { ...pathway };
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
  delete transition.condition;
}

export function removeTransition(pathway: Pathway, stateKey: string, transitionId: string): void {
  const transitions = pathway.states[stateKey].transitions.filter(
    (transition: Transition) => transition.id !== transitionId
  );
  pathway.states[stateKey].transitions = transitions;
}

export function removeAction(pathway: Pathway, stateKey: string, actionId: string): void {
  if (pathway.states[stateKey].action) {
    const actions = pathway.states[stateKey].action.filter(
      (action: Action) => action.id !== actionId
    );
    pathway.states[stateKey].action = actions;
  }
}
