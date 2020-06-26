import samplepathway from './fixtures/sample_pathway.json';
import * as Builder from 'utils/builder';
import { Pathway, Criteria, Transition, Action } from 'pathways-model';

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
    const exportedPathway = Builder.exportPathway(pathway);
    const exportedPathwayJson: Pathway = JSON.parse(exportedPathway);

    // Check the id for criteria has been stripped
    exportedPathwayJson.criteria.forEach((criteria: Criteria) =>
      expect('id' in criteria).toBeFalsy()
    );

    // Check the key, ids, and elm have been stripped
    Object.keys(exportedPathwayJson.states).forEach((stateName: string) => {
      const state = exportedPathwayJson.states[stateName];
      expect('key' in state).toBeFalsy();

      state.transitions.forEach((transition: Transition) => {
        expect('id' in transition).toBeFalsy();
        expect('elm' in transition).toBeFalsy();
      });

      if ('action' in state) {
        state.action.forEach((action: Action) => expect('id' in action).toBeFalsy());
        expect('elm' in state).toBeFalsy();
      }
    });

    expect(exportedPathwayJson.elm?.navigational).toBeDefined();
    expect(exportedPathwayJson.elm?.navigational).toEqual({
      library: {
        identifier: {
          id: 'test_breast_cancer',
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
            },
            {
              localIdentifier: 'example',
              uri: 'urn:example-org'
            },
            {
              localIdentifier: 'example2',
              uri: 'urn:example2-org'
            }
          ]
        },
        includes: {
          def: [
            {
              path: 'example-path',
              version: '1.0'
            },
            {
              path: 'example-path-2',
              version: '1.0'
            },
            {
              path: 'example-path-3',
              version: '1.0'
            }
          ]
        },
        valueSets: {
          def: [
            {
              name: 'example',
              id: '1',
              accessLevel: 'Public',
              resultTypeSpecifier: {}
            },
            {
              name: 'example2',
              id: '2',
              accessLevel: 'Public',
              resultTypeSpecifier: {}
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
            },
            {
              name: 'T = T0',
              context: 'Patient',
              expression: {}
            },
            {
              name: 'T = T1',
              context: 'Patient',
              expression: {}
            },
            {
              name: 'N = N0',
              context: 'Patient',
              expression: {}
            },
            {
              name: 'N = N1',
              context: 'Patient',
              expression: {}
            },
            {
              name: 'Surgery',
              context: 'Patient',
              expression: {}
            },
            {
              name: 'Radiation',
              context: 'Patient',
              expression: {}
            },
            {
              name: 'OtherRadiation',
              context: 'Patient',
              expression: {}
            },
            {
              name: 'Chemo',
              context: 'Patient',
              expression: {}
            },
            {
              name: 'ChemoMedication',
              context: 'Patient',
              expression: {}
            }
          ]
        },
        codeSystems: {
          def: [
            {
              id: 'http://snomed.info/sct',
              name: 'SNOMED',
              accessLevel: 'Public'
            }
          ]
        },
        codes: {
          def: [
            {
              id: '367336001',
              name: 'Chemotherapy code',
              accessLevel: 'Public',
              codeSystem: {
                name: 'SNOMED'
              }
            }
          ]
        }
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

  it('add guidance state', () => {
    const existingStates = Object.keys(pathway.states);
    const newPathway = Builder.addGuidanceState(pathway);

    const newStateKey = Object.keys(newPathway.states).find(
      state => !existingStates.includes(state)
    );
    expect(newPathway.states[newStateKey]).toEqual(
      expect.objectContaining({
        label: 'New Node',
        transitions: [],
        action: [],
        cql: ''
      })
    );
  });

  it('add transition', () => {
    const startStateKey = 'Surgery';
    const endStateKey = 'N-test';

    const newPathway = Builder.addTransition(pathway, startStateKey, endStateKey);

    expect(pathway.states[startStateKey].transitions).toEqual([]);
    expect(newPathway.states[startStateKey].transitions[0]).toEqual(
      expect.objectContaining({
        transition: endStateKey
      })
    );
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
  const elm = {
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
          },
          {
            name: 'Tumor Size'
          }
        ]
      },
      includes: { def: [] },
      valueSets: { def: [] }
    }
  };

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
    Builder.setTransitionCondition(pathway, startStateKey, transitionId, 'test description', elm);
    const expectedTransition = {
      id: '1',
      transition: 'Radiation',
      condition: {
        description: 'test description',
        cql: 'Tumor Size',
        elm: elm
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

  it('set transition condition elm', () => {
    const startStateKey = 'T-test';
    const transitionId = '1';
    Builder.setTransitionConditionElm(pathway, startStateKey, transitionId, elm);
    expect(pathway.states[startStateKey].transitions[0].condition.cql).toBe('Tumor Size');
  });

  it('set guidance state elm', () => {
    const key = 'Radiation';
    const newPathway = Builder.setGuidanceStateElm(pathway, key, elm);
    expect(newPathway.states[key].cql).toBe('Tumor Size');
    expect(newPathway.states[key].elm).toEqual(elm);
  });

  it('set state label', () => {
    const key = 'T-test';

    const newPathway = Builder.setStateLabel(pathway, key, 'test label');

    expect(pathway.states[key].label).toBe('T-test');
    expect(newPathway.states[key].label).toBe('test label');
  });

  describe('setStateNodeType', () => {
    it('converts a branch state into a guidance state', () => {
      const key = 'N-test';
      const newPathway = Builder.setStateNodeType(pathway, key, 'action');
      expect(newPathway.states[key].cql).toEqual('');
    });

    it('converts a guidance state intoa a branch state', () => {
      const key = 'Surgery';
      const newPathway = Builder.makeStateBranch(pathway, key);
      expect(newPathway.states[key].cql).not.toBeDefined();
    });
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

  it('set action resource display', () => {
    const stateKey = 'Chemo';
    const actionId = '1';
    Builder.setActionResourceDisplay(pathway, stateKey, actionId, 'test');
    expect(pathway.states[stateKey].action[0].resource.code.coding[0].display).toBe('test');
  });

  describe('makeStateGuidance', () => {
    it('converts a branch state into a guidance state', () => {
      const key = 'N-test';
      const newPathway = Builder.makeStateGuidance(pathway, key);
      expect(newPathway.states[key].cql).toEqual('');
      expect(newPathway.states[key].action).toEqual([]);
      expect(newPathway.states[key].nodeTypeIsUndefined).not.toBeDefined();
    });

    it('does not modify its argument', () => {
      const key = 'N-test';
      Builder.makeStateGuidance(pathway, key);

      expect(pathway.states[key].cql).not.toBeDefined();
      expect(pathway.states[key].action).not.toBeDefined();
    });
  });

  describe('makeStateBranch', () => {
    it('converts a guidance state intoa a branch state', () => {
      const key = 'Surgery';
      const newPathway = Builder.makeStateBranch(pathway, key);
      expect(newPathway.states[key].cql).not.toBeDefined();
      expect(newPathway.states[key].action).not.toBeDefined();
      expect(newPathway.states[key].nodeTypeIsUndefined).not.toBeDefined();
    });

    it('does not modify its argument', () => {
      const key = 'Surgery';
      Builder.makeStateBranch(pathway, key);

      expect(pathway.states[key].cql).toBeDefined();
      expect(pathway.states[key].action).toBeDefined();
    });
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

describe('builder interface helper functions', () => {
  it('create CQL from action', () => {
    const action = {
      id: '1',
      type: 'create',
      description: 'test action',
      resource: {}
    };

    // Test MedicationRequest
    const medicationRequest = {
      resourceType: 'MedicationRequest',
      medicationCodeableConcept: {
        coding: [
          {
            system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
            code: '1922509',
            display: 'trastuzumab'
          }
        ],
        text: 'trastuzumab'
      }
    };
    action.resource = medicationRequest;
    let cql = Builder.createCQL(action, 'TestNode').replace(/\s+/g, '');
    expect(cql).toEqual(
      expect.stringContaining(
        `Tuple{ resourceType: 'MedicationRequest', id: R.id.value, status: R.status.value}`.replace(
          /\s+/g,
          ''
        )
      )
    );

    // Test ServiceRequest
    const serviceRequest = {
      resourceType: 'ServiceRequest',
      code: {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: '392021009',
            display: 'Lumpectomy of breast (procedure)'
          }
        ],
        text: 'Lumpectomy of breast (procedure)'
      }
    };
    action.resource = serviceRequest;
    cql = Builder.createCQL(action, 'TestNode').replace(/\s+/g, '');
    expect(cql).toEqual(
      expect.stringContaining(
        `return Tuple{ resourceType: 'Procedure', id: R.id.value, status: R.status.value }`.replace(
          /\s+/g,
          ''
        )
      )
    );
    expect(cql).toEqual(
      expect.stringContaining(
        `Tuple{ resourceType: 'ServiceRequest', id: R.id.value, status: R.status.value }`.replace(
          /\s+/g,
          ''
        )
      )
    );

    // Test CarePlan
    const carePlan = {
      resourceType: 'CarePlan',
      title: 'ChemotherapyTH'
    };
    action.resource = carePlan;
    cql = Builder.createCQL(action, 'TestNode').replace(/\s+/g, '');
    expect(cql).toEqual(
      expect.stringContaining(
        `[CarePlan] R where R.title.value='ChemotherapyTH' 
        return Tuple{ resourceType: 'CarePlan', id: R.id.value , status: R.status.value}`.replace(
          /\s+/g,
          ''
        )
      )
    );
  });
});
