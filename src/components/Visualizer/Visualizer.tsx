import React, { FC, memo } from 'react';
import example from './exampleTest.json';
import { Graphviz } from 'graphviz-react';
import { ActivityDefinition, Bundle, PlanDefinition } from 'fhir-objects';

interface TransitionData {
  [key: string]: string | number;
}
const Visualizer: FC = () => {
  const makeTransition = (fromState: string, toState: string): string => {
    const transitionData: TransitionData = {
      id: fromState + '_' + toState,
      label: '',
      penwidth: 2
    };

    const transitionParams = Object.keys(transitionData)
      .map(key => `${key} = "${transitionData[key]}"`)
      .join(', ');

    const transitionAsDOT = '"' + fromState + '" -> "' + toState + '" [' + transitionParams + ']';
    return transitionAsDOT;
  };
  const cpg = example as Bundle;
  const transitions: string[] = [];
  const resources = cpg.entry
    .map(state => {
      console.log(state);
      const resource = state.resource;
      if (resource && resource.id && resource.resourceType) {
        const fromState = resource.id;
        let label = resource.resourceType;
        console.log(label);
        if (label === 'PlanDefinition') {
          console.log('WE B');
          const planDef = resource as PlanDefinition;
          label += `:\n${planDef.title}`;
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
          label += `:\n${activityDef.title}`;
        }
        const node: { [key: string]: string } = {
          id: resource.id,
          shape: 'record',
          style: 'rounded,filled',
          fillcolor: 'White',
          penwidth: '2',
          fontcolor: 'Black',
          label: label
        };
        const nodeParams = Object.keys(node)
          .map(key => `${key} = "${node[key]}"`)
          .join(', ');

        const nodeAsDOT = '"' + resource.id + '" [' + nodeParams + ']';
        return nodeAsDOT;
      } else {
        return '';
      }
    })
    .join('\n');

  const graphTransitions = transitions.join('\n');
  console.log(graphTransitions);
  let graph = 'digraph G {';
  graph += resources;
  graph += graphTransitions;
  graph += '}';

  return (
    <div>
      <Graphviz dot={graph}></Graphviz>
    </div>
  );
};

export default memo(Visualizer);
