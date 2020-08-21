import { useCallback, useState } from 'react';
import { graphlib, Node } from 'dagre';
import { Edges } from 'graph-model';

export interface GraphCoordinates {
  nodes: NodeCoordinates;
  edges: Edges;
}

export interface NodeCoordinates {
  [nodeName: string]: Node;
}

interface ExtractCoordinatesInterface {
  graph: graphlib.Graph;
  xOffset: number;
  yOffset: number;
}

export interface UpdateCoordinatesInterface {
  graph: graphlib.Graph;
  graphWidth: number;
}

export interface CoordinatesCalculator {
  coordinates: GraphCoordinates;
  updateCoordinates: (graph: UpdateCoordinatesInterface) => void;
}

// number of pixels to add as a buffer to the top of the graph
const OFFSET_TOP = 16;

const useCoordinatesCalculator = (): CoordinatesCalculator => {
  const [coordinates, setCoordinates] = useState<GraphCoordinates>({
    nodes: {},
    edges: {}
  } as GraphCoordinates);

  const updateCoordinates = useCallback(
    ({ graph, graphWidth }: UpdateCoordinatesInterface): void => {
      const startNodeShift = graph.node('Start').x;

      const xOffset = 0 - startNodeShift + graphWidth / 2;
      let xOffsetCorrection = 0;
      const yOffset = OFFSET_TOP;

      const newCoordinates: GraphCoordinates = { nodes: {}, edges: {} };

      for (const nodeKey of graph.nodes()) {
        const node = graph.node(nodeKey);

        // dagre returns coordinates for the center of the node,
        // our renderer expects coordinates for the corner of the node.
        // further, our renderer expects the Start node to be centered at x: 0
        newCoordinates.nodes[nodeKey] = {
          ...node,
          x: node.x - node.width / 2 + xOffset,
          y: node.y - node.height / 2 + yOffset
        };

        xOffsetCorrection = Math.min(0, xOffsetCorrection, newCoordinates.nodes[nodeKey].x);
      }
      xOffsetCorrection = Math.abs(xOffsetCorrection);

      if (xOffsetCorrection > 0) {
        for (const nodeKey of graph.nodes()) {
          newCoordinates.nodes[nodeKey].x += xOffsetCorrection;
        }
      }

      for (const edgeKey of graph.edges()) {
        const edge = graph.edge(edgeKey);
        const edgeName = `${edgeKey.v}, ${edgeKey.w}`;
        const label = edge.label
          ? { text: edge.label, x: edge.x + xOffset, y: edge.y + yOffset }
          : null;

        const points = edge.points.map(point => ({
          x: (isNaN(point.x) ? 0 : point.x) + xOffset + xOffsetCorrection,
          y: (isNaN(point.y) ? 0 : point.y) + yOffset
        }));

        // move the last point up to make room for the arrowhead
        if (points.length > 0) points[points.length - 1].y -= 17.5;

        newCoordinates.edges[edgeName] = {
          label,
          start: edgeKey.v,
          end: edgeKey.w,
          points
        };
      }

      setCoordinates(newCoordinates);
    },
    []
  );

  return { coordinates, updateCoordinates };
};

export default useCoordinatesCalculator;
