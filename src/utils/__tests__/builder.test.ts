import samplepathway from './fixtures/sample_pathway.json';
import * as Builder from 'utils/builder';
import { Pathway, Precondition, Transition, Action, ActionNode } from 'pathways-model';

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
      preconditions: [],
      nodes: {
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

    // Check the id for precondition has been stripped
    exportedPathwayJson.preconditions.forEach((precondition: Precondition) =>
      expect('id' in precondition).toBeFalsy()
    );

    // Check the key, ids, and elm have been stripped
    Object.keys(exportedPathwayJson.nodes).forEach((nodeKey: string) => {
      const node = exportedPathwayJson.nodes[nodeKey];
      expect('key' in node).toBeFalsy();

      node.transitions.forEach((transition: Transition) => {
        expect('id' in transition).toBeFalsy();
        expect('elm' in transition).toBeFalsy();
      });

      if ('action' in node) {
        node.action.forEach((action: Action) => expect('id' in action).toBeFalsy());
        expect('elm' in node).toBeFalsy();
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

  it('add preconditions', () => {
    const id = Builder.addPrecondition(pathway, 'test element name', 'test expected', 'test cql');
    const precondition = pathway.preconditions[pathway.preconditions.length - 1];
    const expectedPrecondition = {
      id: id,
      elementName: 'test element name',
      expected: 'test expected',
      cql: 'test cql'
    };
    expect(precondition).toBeDefined();
    expect(precondition).toEqual(expectedPrecondition);
  });

  it('add action node', () => {
    const existingNodes = Object.keys(pathway.nodes);
    const newPathway = Builder.addActionNode(pathway);

    const newNodeKey = Object.keys(newPathway.nodes).find(node => !existingNodes.includes(node));
    expect(newPathway.nodes[newNodeKey]).toEqual(
      expect.objectContaining({
        label: 'New Node',
        transitions: [],
        action: [],
        cql: ''
      })
    );
  });

  it('add transition', () => {
    const startNodeKey = 'Surgery';
    const endNodeKey = 'N-test';

    const newPathway = Builder.addTransition(pathway, startNodeKey, endNodeKey);

    expect(pathway.nodes[startNodeKey].transitions).toEqual([]);
    expect(newPathway.nodes[startNodeKey].transitions[0]).toEqual(
      expect.objectContaining({
        transition: endNodeKey
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
    expect(pathway.nodes[key].action[1]).toEqual(expectedAction);
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
    const newPathway = Builder.setPathwayName(pathway, 'test name');
    expect(newPathway.name).toBe('test name');
  });

  it('set pathway description', () => {
    const newPathway = Builder.setPathwayDescription(pathway, 'test description');
    expect(newPathway.description).toBe('test description');
  });

  it('set library', () => {
    const newPathway = Builder.setLibrary(pathway, 'library.cql');
    expect(newPathway.library).toBe('library.cql');
  });

  it('set navigational elm', () => {
    const elm = {};
    const newPathway = Builder.setNavigationalElm(pathway, elm);
    expect(newPathway.elm?.navigational).toEqual(elm);
  });

  it('set precondition elm', () => {
    const elm = {};
    const newPathway = Builder.setPreconditionElm(pathway, elm);
    expect(newPathway.elm?.preconditions).toEqual(elm);
  });

  it('set transition', () => {
    const startNodeKey = 'ChemoMedication';
    const endNodeKey = 'Start';
    const transitionId = '1';

    const newPathway = Builder.setTransition(pathway, startNodeKey, endNodeKey, transitionId);
    expect(newPathway.nodes[startNodeKey].transitions[0].transition).toBe(endNodeKey);
  });

  it('set transition condition', () => {
    const startNodeKey = 'N-test';
    const transitionId = '1';
    const newPathway = Builder.setTransitionCondition(
      pathway,
      startNodeKey,
      transitionId,
      'test description',
      elm
    );
    const expectedTransition = {
      id: '1',
      transition: 'Radiation',
      condition: {
        description: 'test description',
        cql: 'Tumor Size',
        elm: elm
      }
    };
    expect(newPathway.nodes[startNodeKey].transitions[0]).toEqual(expectedTransition);
  });

  it('set transition condition description', () => {
    const startNodeKey = 'T-test';
    const transitionId = '1';
    const newPathway = Builder.setTransitionConditionDescription(
      pathway,
      startNodeKey,
      transitionId,
      'test description'
    );
    expect(newPathway.nodes[startNodeKey].transitions[0].condition.description).toBe(
      'test description'
    );
  });

  it('set transition condition elm', () => {
    const startNodeKey = 'T-test';
    const transitionId = '1';
    const newPathway = Builder.setTransitionConditionElm(pathway, startNodeKey, transitionId, elm);
    expect(newPathway.nodes[startNodeKey].transitions[0].condition.cql).toBe('Tumor Size');
  });

  it('set action node elm', () => {
    const key = 'Radiation';
    const newPathway = Builder.setActionNodeElm(pathway, key, elm);
    expect(newPathway.nodes[key].cql).toBe('Tumor Size');
    expect(newPathway.nodes[key].elm).toEqual(elm);
  });

  it('set node label', () => {
    const key = 'T-test';

    const newPathway = Builder.setNodeLabel(pathway, key, 'test label');

    expect(pathway.nodes[key].label).toBe('T-test');
    expect(newPathway.nodes[key].label).toBe('test label');
  });

  describe('setNodeType', () => {
    it('converts a branch node into a action node', () => {
      const key = 'N-test';
      const newPathway = Builder.setNodeType(pathway, key, 'action');
      expect(newPathway.nodes[key].cql).toEqual('');
    });

    it('converts a action node into a branch node', () => {
      const key = 'Surgery';
      const newPathway = Builder.makeNodeBranch(pathway, key);
      expect(newPathway.nodes[key].cql).not.toBeDefined();
    });
  });

  it('set action type', () => {
    const nodeKey = 'Chemo';
    const actionId = '1';
    const newPathway = Builder.setActionType(pathway, nodeKey, actionId, 'delete');
    expect(newPathway.nodes[nodeKey].action[0].type).toBe('delete');
  });

  it('set action descrtiption', () => {
    const nodeKey = 'Chemo';
    const actionId = '1';
    const newPathway = Builder.setActionDescription(pathway, nodeKey, actionId, 'test description');
    expect(newPathway.nodes[nodeKey].action[0].description).toBe('test description');
  });

  it('set action resource', () => {
    const nodeKey = 'Chemo';
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
    const newPathway = Builder.setActionResource(pathway, nodeKey, actionId, resource);
    expect(newPathway.nodes[nodeKey].action[0].resource).toEqual(resource);
  });

  it('set action resource display', () => {
    const nodeKey = 'Chemo';
    const newAction = Builder.setActionResourceDisplay(
      (pathway.nodes[nodeKey] as ActionNode).action[0],
      'test'
    );
    expect(newAction.resource.code.coding[0].display).toBe('test');
  });

  describe('makeNodeAction', () => {
    it('converts a branch node into a action node', () => {
      const key = 'N-test';
      const newPathway = Builder.makeNodeAction(pathway, key);
      expect(newPathway.nodes[key].cql).toEqual('');
      expect(newPathway.nodes[key].action).toEqual([]);
      expect(newPathway.nodes[key].nodeTypeIsUndefined).not.toBeDefined();
    });

    it('does not modify its argument', () => {
      const key = 'N-test';
      Builder.makeNodeAction(pathway, key);

      expect(pathway.nodes[key].cql).not.toBeDefined();
      expect(pathway.nodes[key].action).not.toBeDefined();
    });
  });

  describe('makeNodeBranch', () => {
    it('converts a action node intoa a branch node', () => {
      const key = 'Surgery';
      const newPathway = Builder.makeNodeBranch(pathway, key);
      expect(newPathway.nodes[key].cql).not.toBeDefined();
      expect(newPathway.nodes[key].action).not.toBeDefined();
      expect(newPathway.nodes[key].nodeTypeIsUndefined).not.toBeDefined();
    });

    it('does not modify its argument', () => {
      const key = 'Surgery';
      Builder.makeNodeBranch(pathway, key);

      expect(pathway.nodes[key].cql).toBeDefined();
      expect(pathway.nodes[key].action).toBeDefined();
    });
  });
});

describe('builder interface remove functions', () => {
  // Create a deep copy of the pathway
  const pathway = JSON.parse(JSON.stringify(samplepathway)) as Pathway;

  it('remove pathway description', () => {
    const newPathway = Builder.removePathwayDescription(pathway);
    expect('description' in newPathway).toBeFalsy();
  });

  it('remove preconditions', () => {
    const id = '1';
    const newPathway = Builder.removePrecondition(pathway, id);
    expect(newPathway.preconditions.length).toBe(0);
  });

  it('remove navigational elm', () => {
    const newPathway = Builder.removeNavigationalElm(pathway);
    if (newPathway.elm) expect('navigational' in newPathway.elm).toBeFalsy();
    else fail();
  });

  it('remove criteria elm', () => {
    const newPathway = Builder.removePreconditionElm(pathway);
    if (newPathway.elm) expect('preconditions' in newPathway.elm).toBeFalsy();
    else fail();
  });

  it('remove node', () => {
    const key = 'ChemoMedication';
    const newPathway = Builder.removeNode(pathway, key);
    expect(key in newPathway.nodes).toBeFalsy();

    // Test removed from all transitions
    Object.keys(newPathway.nodes).forEach((nodeKey: string) => {
      const node = newPathway.nodes[nodeKey];
      node.transitions.forEach((transition: Transition) =>
        expect(transition.transition).not.toBe(key)
      );
    });
  });

  it('remove transition condition', () => {
    const nodeKey = 'N-test';
    const transitionId = '2';
    const newPathway = Builder.removeTransitionCondition(pathway, nodeKey, transitionId);
    expect('condition' in newPathway.nodes[nodeKey].transitions[1]).toBeFalsy();
  });

  it('remove transition', () => {
    const nodeKey = 'T-test';
    const transitionId = '1';
    const newPathway = Builder.removeTransition(pathway, nodeKey, transitionId);
    expect(newPathway.nodes[nodeKey].transitions.length).toBe(1);
    expect(newPathway.nodes[nodeKey].transitions[0].id).not.toBe(transitionId);
  });

  it('remove action', () => {
    const nodeKey = 'Surgery';
    const actionId = '1';
    const newPathway = Builder.removeAction(pathway, nodeKey, actionId);
    expect(newPathway.nodes[nodeKey].action.length).toBe(0);
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
