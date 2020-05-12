import { Pathway, Criteria, State, Transition, Action, GuidanceState } from 'pathways-model';
import shortid from 'shortid';
import { MedicationRequest, ServiceRequest } from 'fhir-objects';

export function createNewPathway(name: string, description?: string): Pathway {
  return {
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

export function addLibrary(pathway: Pathway, library: string): void {
  pathway.library = library;
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

export function addNavigationalElm(pathway: Pathway, elm: object): void {
  if (!pathway.elm) pathway.elm = {};
  pathway.elm.navigational = elm;
}

export function addCriteriaElm(pathway: Pathway, elm: object): void {
  if (!pathway.elm) pathway.elm = {};
  pathway.elm.criteria = elm;
}

function addState(pathway: Pathway, key?: string): string {
  if (!key) key = shortid.generate();
  const state: State = {
    key: key,
    label: '',
    transitions: []
  };
  pathway.states[key] = state;

  return key;
}

export function addBranchState(pathway: Pathway): string {
  const key = shortid.generate();
  return addState(pathway, key);
}

export function addGuidanceState(pathway: Pathway): string {
  const key = shortid.generate();
  addState(pathway, key);
  makeBranchStateGuidance(pathway, key);
  return key;
}

export function addStateLabel(pathway: Pathway, key: string, label: string): void {
  pathway.states[key].label = label;
}

export function addTransition(
  pathway: Pathway,
  startStateKey: string,
  endStateKey: string
): string {
  const id = shortid.generate();
  const transition: Transition = {
    id: id,
    transition: endStateKey
  };
  pathway.states[startStateKey].transitions.push(transition);
  return id;
}

export function addTransitionCondition(
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

export function addGuidanceStateCql(pathway: Pathway, key: string, cql: string): void {
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

/*
Update Element Functions
*/
export function updatePathwayName(pathway: Pathway, name: string): void {
  pathway.name = name;
}

export function updatePathwayDescription(pathway: Pathway, description: string): void {
  pathway.description = description;
}

export function updateTransition(
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

export function updateTransitionConditionDescription(
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

export function updateTransitionConditionCql(
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

export function updateActionType(
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

export function updateActionDescription(
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

export function updateActionResource(
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

export function makeBranchStateGuidance(pathway: Pathway, key: string): void {
  const state = pathway.states[key];
  if (!('action' in state)) {
    state.cql = '';
    state.action = [];
  }
}

export function makeGuidanceStateBranch(pathway: Pathway, key: string): void {
  const state = pathway.states[key];
  delete state.cql;
  delete state.action;
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
