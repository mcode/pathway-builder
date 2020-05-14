import samplepathway from './fixtures/sample_pathway.json';
import * as Builder from 'utils/builder';
import { Pathway, Criteria, Transition, GuidanceState, Action } from 'pathways-model';

describe('builder interface add functions', () => {
  // Create a deep copy of the pathway
  const pathway = JSON.parse(JSON.stringify(samplepathway)) as Pathway;

  it('create new pathway', () => {
    const newPathway = Builder.createNewPathway('name', 'description', '1');
    const expectedPathway = {
      id: '1',
      name: 'name',
      description: 'description',
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
    expect(newPathway).toEqual(expectedPathway);
  });

  it('export pathway', () => {
    const _pathway = JSON.parse(JSON.stringify(pathway)); // create a deep copy
    const exportedPathway = Builder.exportPathway(_pathway);
    expect(exportedPathway.length).toBeGreaterThan(0);
    const exportedPathwayJson: Pathway = JSON.parse(exportedPathway);
    expect(exportedPathwayJson).toBeDefined();

    // Check the id for criteria has been stripped
    exportedPathwayJson.criteria.forEach((criteria: Criteria) =>
      expect('id' in criteria).toBeFalsy()
    );

    // Check the key and ids have been stripped
    Object.keys(exportedPathwayJson.states).forEach((stateName: string) => {
      const state = exportedPathwayJson.states[stateName];
      expect('key' in state).toBeFalsy();

      state.transitions.forEach((transition: Transition) => expect('id' in transition).toBeFalsy());

      if ('action' in state) {
        (state as GuidanceState).action.forEach((action: Action) =>
          expect('id' in action).toBeFalsy()
        );
      }
    });
  });

  it('add criteria', () => {
    const id = Builder.addCriteria(pathway, 'test element name', 'test expected', 'test cql');
    const criteria = pathway.criteria[pathway.criteria.length - 1];
    const expectedCriteria = {
      id: id,
      elementName: 'test element name',
      expected: 'test expected',
      cql: 'test cql'
    };
    expect(criteria).toBeDefined();
    expect(criteria).toEqual(expectedCriteria);
  });

  it('add branch state', () => {
    const key = Builder.addBranchState(pathway);
    const expectedState = {
      key: key,
      label: '',
      transitions: []
    };
    expect(pathway.states[key]).toEqual(expectedState);
  });

  it('add guidance state', () => {
    const key = Builder.addGuidanceState(pathway);
    const expectedState = {
      key: key,
      label: '',
      transitions: [],
      action: [],
      cql: ''
    };
    expect(pathway.states[key]).toEqual(expectedState);
  });

  it('add transition', () => {
    const startStateKey = 'Surgery';
    const endStateKey = 'N-test';
    const id = Builder.addTransition(pathway, startStateKey, endStateKey);
    const expectedTransition = {
      id: id,
      transition: endStateKey
    };
    expect(pathway.states[startStateKey].transitions[0]).toEqual(expectedTransition);
  });

  it('add action', () => {
    const key = 'OtherRadiation';
    const resource = {
      resourceType: 'ServiceRequest',
      code: {
        coding: [
          {
            system: 'http://example.com',
            code: '1234',
            display: 'Test procedure'
          }
        ],
        text: 'Test procedure'
      }
    };

    const id = Builder.addAction(pathway, key, 'create', 'test description', resource);
    const expectedAction = {
      id: id,
      type: 'create',
      description: 'test description',
      resource: resource
    };
    expect(pathway.states[key].action.pop()).toEqual(expectedAction);
  });
});

describe('builder interface update functions', () => {
  // Create a deep copy of the pathway
  const pathway = JSON.parse(JSON.stringify(samplepathway)) as Pathway;

  it('set pathway name', () => {
    Builder.setPathwayName(pathway, 'test name');
    expect(pathway.name).toBe('test name');
  });

  it('set pathway description', () => {
    Builder.setPathwayDescription(pathway, 'test description');
    expect(pathway.description).toBe('test description');
  });

  it('set library', () => {
    Builder.setLibrary(pathway, 'library.cql');
    expect(pathway.library).toBe('library.cql');
  });

  it('set navigational elm', () => {
    const elm = {};
    Builder.setNavigationalElm(pathway, elm);
    expect(pathway.elm?.navigational).toEqual(elm);
  });

  it('set criteria elm', () => {
    const elm = {};
    Builder.setCriteriaElm(pathway, elm);
    expect(pathway.elm?.criteria).toEqual(elm);
  });

  it('set transition', () => {
    const startStateKey = 'ChemoMedication';
    const endStateKey = 'Start';
    const transitionId = '1';

    Builder.setTransition(pathway, startStateKey, endStateKey, transitionId);
    expect(pathway.states[startStateKey].transitions[0].transition).toBe(endStateKey);
  });

  it('set transition condition', () => {
    const startStateKey = 'N-test';
    const transitionId = '1';
    Builder.setTransitionCondition(
      pathway,
      startStateKey,
      transitionId,
      'test description',
      'test cql'
    );
    const expectedTransition = {
      id: '1',
      transition: 'Radiation',
      condition: {
        description: 'test description',
        cql: 'test cql'
      }
    };
    expect(pathway.states[startStateKey].transitions[0]).toEqual(expectedTransition);
  });

  it('set transition condition description', () => {
    const startStateKey = 'T-test';
    const transitionId = '1';
    Builder.setTransitionConditionDescription(
      pathway,
      startStateKey,
      transitionId,
      'test description'
    );
    expect(pathway.states[startStateKey].transitions[0].condition.description).toBe(
      'test description'
    );
  });

  it('set transition condition cql', () => {
    const startStateKey = 'T-test';
    const transitionId = '1';
    Builder.setTransitionConditionCql(pathway, startStateKey, transitionId, 'test cql');
    expect(pathway.states[startStateKey].transitions[0].condition.cql).toBe('test cql');
  });

  it('set guidance state cql', () => {
    const key = 'Radiation';
    Builder.setGuidanceStateCql(pathway, key, 'test cql');
    expect(pathway.states[key].cql).toBe('test cql');
  });

  it('set state label', () => {
    const key = 'T-test';
    Builder.setStateLabel(pathway, key, 'test label');
    expect(pathway.states[key].label).toBe('test label');
  });

  it('set action type', () => {
    const stateKey = 'Chemo';
    const actionId = '1';
    Builder.setActionType(pathway, stateKey, actionId, 'delete');
    expect(pathway.states[stateKey].action[0].type).toBe('delete');
  });

  it('set action descrtiption', () => {
    const stateKey = 'Chemo';
    const actionId = '1';
    Builder.setActionDescription(pathway, stateKey, actionId, 'test description');
    expect(pathway.states[stateKey].action[0].description).toBe('test description');
  });

  it('set action resource', () => {
    const stateKey = 'Chemo';
    const actionId = '1';
    const resource = {
      resourceType: 'ServiceRequest',
      code: {
        coding: [
          {
            system: 'http://example.com',
            code: '1234',
            display: 'Test procedure'
          }
        ],
        text: 'Test procedure'
      }
    };
    Builder.setActionResource(pathway, stateKey, actionId, resource);
    expect(pathway.states[stateKey].action[0].resource).toEqual(resource);
  });

  it('make branch state a guidance state', () => {
    const key = 'N-test';
    Builder.makeBranchStateGuidance(pathway, key);
    expect(pathway.states[key].cql).toBe('');
    expect(pathway.states[key].action).toEqual([]);
  });

  it('make guidance state a branch state', () => {
    const key = 'Surgery';
    Builder.makeGuidanceStateBranch(pathway, key);
    expect('cql' in pathway.states[key]).toBeFalsy();
    expect('action' in pathway.states[key]).toBeFalsy();
  });
});

describe('builder interface remove functions', () => {
  // Create a deep copy of the pathway
  const pathway = JSON.parse(JSON.stringify(samplepathway)) as Pathway;

  it('remove pathway description', () => {
    Builder.removePathwayDescription(pathway);
    expect('description' in pathway).toBeFalsy();
  });

  it('remove criteria', () => {
    const id = '1';
    Builder.removeCriteria(pathway, id);
    expect(pathway.criteria.length).toBe(0);
  });

  it('remove navigational elm', () => {
    Builder.removeNavigationalElm(pathway);
    if (pathway.elm) expect('navigational' in pathway.elm).toBeFalsy();
    else fail();
  });

  it('remove criteria elm', () => {
    Builder.removeCriteriaElm(pathway);
    if (pathway.elm) expect('criteria' in pathway.elm).toBeFalsy();
    else fail();
  });

  it('remove state', () => {
    const key = 'ChemoMedication';
    Builder.removeState(pathway, key);
    expect(key in pathway.states).toBeFalsy();

    // Test removed from all transitions
    Object.keys(pathway.states).forEach((stateName: string) => {
      const state = pathway.states[stateName];
      state.transitions.forEach((transition: Transition) =>
        expect(transition.transition).not.toBe(key)
      );
    });
  });

  it('remove transition condition', () => {
    const stateKey = 'N-test';
    const transitionId = '2';
    Builder.removeTransitionCondition(pathway, stateKey, transitionId);
    expect('condition' in pathway.states[stateKey].transitions[1]).toBeFalsy();
  });

  it('remove transition', () => {
    const stateKey = 'T-test';
    const transitionId = '1';
    Builder.removeTransition(pathway, stateKey, transitionId);
    expect(pathway.states[stateKey].transitions.length).toBe(1);
    expect(pathway.states[stateKey].transitions[0].id).not.toBe(transitionId);
  });

  it('remove action', () => {
    const stateKey = 'Surgery';
    const actionId = '1';
    Builder.removeAction(pathway, stateKey, actionId);
    expect(pathway.states[stateKey].action.length).toBe(0);
  });
});
