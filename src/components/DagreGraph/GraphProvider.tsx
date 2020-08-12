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
import dagre, { graphlib, Node } from 'dagre';
import { Edges } from 'graph-model';

interface GraphCoordinates {
  nodes: NodeCoordinates;
  edges: Edges;
}

interface NodeCoordinates {
  [nodeName: string]: Node;
}

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

interface ExtractCoordinatesInterface {
  graph: graphlib.Graph;
  graphWidth: number;
}

// number of pixels to add as a buffer to the top of the graph
const OFFSET_TOP = 16;

const extractNodeCoordinates = ({
  graph,
  graphWidth
}: ExtractCoordinatesInterface): NodeCoordinates => {
  const coordinates = {} as NodeCoordinates;
  const startNodeShift = graph.node('Start').x;

  for (const nodeKey of graph.nodes()) {
    const node = graph.node(nodeKey);

    // dagre returns coordinates for the center of the node,
    // our renderer expects coordinates for the corner of the node.
    // further, our renderer expects the Start node to be centered at x: 0
    coordinates[nodeKey] = {
      ...node,
      x: node.x - startNodeShift - node.width / 2 + graphWidth / 2,
      y: node.y - node.height / 2 + OFFSET_TOP
    };
  }

  return coordinates;
};

const extractEdgeCoordinates = ({ graph, graphWidth }: ExtractCoordinatesInterface): Edges => {
  const coordinates = {} as Edges;
  const startNodeShift = graph.node('Start').x;
  const shiftX = (x: number): number => x - startNodeShift + graphWidth / 2;

  for (const edgeKey of graph.edges()) {
    const edge = graph.edge(edgeKey);
    const edgeName = `${edgeKey.v}, ${edgeKey.w}`;
    const label = edge.label
      ? { text: edge.label, x: shiftX(edge.x), y: edge.y + OFFSET_TOP }
      : null;

    const points = edge.points.map(point => ({
      x: isNaN(point.x) ? 0 : shiftX(point.x),
      y: (isNaN(point.y) ? 0 : point.y) + OFFSET_TOP
    }));

    // move the last point up to make room for the arrowhead
    if (points.length > 0) points[points.length - 1].y -= 17.5;

    coordinates[edgeName] = {
      label,
      start: edgeKey.v,
      end: edgeKey.w,
      points
    };
  }

  return coordinates;
};

const GraphProvider: FC<GraphProviderProps> = memo(({ children }) => {
  const graph = useMemo(createGraph, []);
  const [coordinates, setCoordinates] = useState<GraphCoordinates>({
    nodes: {},
    edges: {}
  } as GraphCoordinates);
  const [width, setWidth] = useRafState<number>(0);
  const [reflowRequired, setReflowRequired] = useState(true);
  const reflow = useCallback(() => setReflowRequired(true), []);
  const graphValue = useMemo(() => ({ graph, reflow }), [graph, reflow]);

  useEffect(() => {
    if (!reflowRequired) return;

    dagre.layout(graph);
    setCoordinates({
      nodes: extractNodeCoordinates({ graph, graphWidth: width }),
      edges: extractEdgeCoordinates({ graph, graphWidth: width })
    });
    setReflowRequired(false);
  }, [graph, reflowRequired, setReflowRequired, width]);

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
