import React, { ChangeEvent, FC, memo, useState } from 'react';
import { Graphviz } from 'graphviz-react';
import {
  ActivityDefinition,
  Bundle,
  PlanDefinition,
  Library,
  CpgCarePlan,
  RequestGroup
} from 'fhir-objects';

interface TransitionData {
  [key: string]: string | number;
}
const Visualizer: FC = () => {
  const [cpgString, setCpgString] = useState<string>('');
  const _setCpgString = (event: ChangeEvent<{ value: string }>): void => {
    const value = event.target.value;
    setCpgString(value);
  };
  const makeTransition = (fromState: string, toState: string): string => {
    const transitionData: TransitionData = {
      id: fromState + '_' + toState,
      label: '',
      penwidth: 1
    };

    const transitionParams = Object.keys(transitionData)
      .map(key => `${key} = "${transitionData[key]}"`)
      .join(', ');

    const transitionAsDOT = '"' + fromState + '" -> "' + toState + '" [' + transitionParams + ']';
    return transitionAsDOT;
  };

  const makeNode = (id: string, label: string): string => {
    const node: { [key: string]: string } = {
      id: id,
      shape: 'record',
      style: 'rounded,filled',
      fillcolor: 'White',
      penwidth: '2',
      fontcolor: 'Black',
      label: label.replace(/"/g, '')
    };
    const nodeParams = Object.keys(node)
      .map(key => `${key} = "${node[key]}"`)
      .join(', ');

    const nodeAsDOT = '"' + id + '" [' + nodeParams + ']';
    return nodeAsDOT;
  };

  const parseBundle = (cpg: Bundle, transitions: string[]): string => {
    const resources = cpg.entry
      .map(state => {
        const resource = state.resource;
        if (resource && resource.id && resource.resourceType) {
          const fromState = resource.id;
          let label = resource.resourceType;
          if (label === 'PlanDefinition') {
            const planDef = resource as PlanDefinition;
            // label += `: ${planDef.id}\\n${planDef.title}`;
            const planTransitions = planDef.action
              .map(action => {
                const toState = action.definitionCanonical?.split('/').pop();
                if (toState) {
                  return makeTransition(fromState, toState);
                } else {
                  return '';
                }
              })
              .join('\n');
            transitions.push(planTransitions);

            if (planDef.library) {
              const libraryTransitions = planDef.library
                .map(library => {
                  return makeTransition(fromState, library);
                })
                .join('\n');

              transitions.push(libraryTransitions);
            }
          } else if (label === 'ActivityDefinition') {
            const activityDef = resource as ActivityDefinition;
            label += `: ${activityDef.id} \\n${activityDef.description}`;
          } else if (label === 'Library') {
            const lib = resource as Library;
            label += `: ${lib.id} \\n${lib.title}`;
          }
          return makeNode(resource.id, label);
        } else {
          return '';
        }
      })
      .join('\n');
    return resources;
  };

  const parseCarePlan = (cpg: CpgCarePlan, transitions: string[]): string => {
    if (cpg.contained) {
      let resources = cpg.contained
        .map(resource => {
          if (resource.id && resource.resourceType) {
            const fromState = resource.id;
            let label = resource.resourceType;
            if (label === 'RequestGroup') {
              const reqGroup = resource as RequestGroup;
              label += `: ${reqGroup.id}`;

              if (reqGroup.action) {
                const planTransitions = reqGroup.action
                  .map(action => {
                    const toState = action.resource?.reference;
                    if (toState) {
                      return makeTransition(fromState, toState.substring(1));
                    } else {
                      return '';
                    }
                  })
                  .join('\n');
                transitions.push(planTransitions);
              }
            } else if (label === 'MedicationRequest') {
              label += `: ${resource.id}`;
            } else if (label === 'CarePlan') {
              const carePlan = resource as CpgCarePlan;
              label += `: ${carePlan.id}`;
              if (carePlan && carePlan.activity) {
                const planTransitions = carePlan.activity
                  .map(resource => {
                    if (resource.reference?.reference && carePlan.id) {
                      return makeTransition(
                        carePlan.id,
                        resource.reference?.reference?.substring(1)
                      );
                    } else {
                      return '';
                    }
                  })
                  .join('\n');
                transitions.push(planTransitions);
              }
            }
            return makeNode(fromState, label);
          } else {
            return '';
          }
        })
        .join('\n');
      const main = makeNode(cpg.resourceType, 'Main CarePlan');
      if (cpg.activity) {
        const mainTransitions = cpg.activity
          .map(resource => {
            if (resource.reference?.reference) {
              return makeTransition(cpg.resourceType, resource.reference?.reference?.substring(1));
            } else {
              return '';
            }
          })
          .join('\n');
        transitions.push(mainTransitions);
        resources = resources + `\n${main}`;
      }
      return resources;
    }
    return '';
  };
  const makeGraph = (cpgString: string): string => {
    const cpg = JSON.parse(cpgString);
    const transitions: string[] = [];
    let resources = '';
    if (cpg.entry) {
      resources = parseBundle(cpg, transitions);
    } else {
      resources = parseCarePlan(cpg, transitions);
    }
    const graphTransitions = transitions.join('\n');
    let graph = 'digraph G {';
    graph += resources;
    graph += graphTransitions;
    graph += '}';
    return graph;
  };
  let graph = '';
  try {
    graph = makeGraph(cpgString);
  } catch {
    console.log('Invalid JSON: Please paste a CPG bundle into the textbox');
    graph = '';
  }
  return (
    <div>
      <textarea value={cpgString} onChange={_setCpgString}></textarea>
      {graph && (
        <Graphviz
          dot={graph}
          options={{
            width: '2000',
            zoom: true
          }}
        ></Graphviz>
      )}
    </div>
  );
};

export default memo(Visualizer);
