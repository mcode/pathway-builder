import React, { ChangeEvent, FC, memo, useState } from 'react';
import { Graphviz } from 'graphviz-react';
import { ActivityDefinition, Bundle, PlanDefinition, Library } from 'fhir-objects';

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
      penwidth: 2
    };

    const transitionParams = Object.keys(transitionData)
      .map(key => `${key} = "${transitionData[key]}"`)
      .join(', ');

    const transitionAsDOT = '"' + fromState + '" -> "' + toState + '" [' + transitionParams + ']';
    return transitionAsDOT;
  };
  const makeGraph = (cpgString: string): string => {
    const cpg = JSON.parse(cpgString) as Bundle;
    const transitions: string[] = [];
    const resources = cpg.entry
      .map(state => {
        console.log(state);
        const resource = state.resource;
        if (resource && resource.id && resource.resourceType) {
          const fromState = resource.id;
          let label = resource.resourceType;
          if (label === 'PlanDefinition') {
            const planDef = resource as PlanDefinition;
            label += `: ${planDef.id}\\n${planDef.title}`;
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
            console.log(lib);
            label += `: ${lib.id} \\n${lib.title}`;
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
      {graph && <Graphviz dot={graph}></Graphviz>}
    </div>
  );
};

export default memo(Visualizer);
