import React, {
  createContext,
  FC,
  memo,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useRafState, useUpdateEffect } from 'react-use';
import dagre, { graphlib } from 'dagre';

import useCoordinatesCalculator, { GraphCoordinates } from './useCoordinatesCalculator';

interface GraphContextInterface {
  graph: graphlib.Graph;
  reflow: () => void;
}

type SetGraphWidthInterface = (width: number) => void;

export const GraphContext = createContext<GraphContextInterface>({} as GraphContextInterface);
export const SetGraphWidthContext = createContext<SetGraphWidthInterface>(() => undefined);
export const GraphCoordinatesContext = createContext<GraphCoordinates>({
  nodes: {},
  edges: {}
} as GraphCoordinates);

interface GraphProviderProps {
  children: ReactNode;
}

const createGraph = (): graphlib.Graph => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({});

  // dagre requires a default edge label, we want it to just be empty
  g.setDefaultEdgeLabel(() => ({}));
  return g;
};

const GraphProvider: FC<GraphProviderProps> = memo(({ children }) => {
  const graph = useMemo(createGraph, []);
  const { coordinates, updateCoordinates } = useCoordinatesCalculator();
  const [width, setWidth] = useRafState<number>(0);
  const [reflowRequired, setReflowRequired] = useState(true);
  const reflow = useCallback(() => setReflowRequired(true), []);
  const graphValue = useMemo(() => ({ graph, reflow }), [graph, reflow]);

  useEffect(() => {
    if (!reflowRequired) return;

    dagre.layout(graph);
    updateCoordinates({ graph, graphWidth: width });

    setReflowRequired(false);
  }, [graph, reflowRequired, setReflowRequired, width, updateCoordinates]);

  useUpdateEffect(() => {
    setReflowRequired(true);
  }, [width]);

  return (
    <GraphContext.Provider value={graphValue}>
      <SetGraphWidthContext.Provider value={setWidth}>
        <GraphCoordinatesContext.Provider value={coordinates}>
          {children}
        </GraphCoordinatesContext.Provider>
      </SetGraphWidthContext.Provider>
    </GraphContext.Provider>
  );
});

export default GraphProvider;
export const useGraphProvider = (): GraphContextInterface => useContext(GraphContext);
export const useSetGraphWidth = (): SetGraphWidthInterface => useContext(SetGraphWidthContext);
export const useGraphCoordinates = (): GraphCoordinates => useContext(GraphCoordinatesContext);
