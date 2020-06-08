import React, {
  FC,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo
} from 'react';
import { useParams, useHistory } from 'react-router-dom';

import graphLayout from 'visualization/layout';
import Node from 'components/Node';
import Arrow from 'components/Arrow';
import { Pathway } from 'pathways-model';
import { Layout, NodeDimensions, NodeCoordinates, Edges } from 'graph-model';
import styles from './Graph.module.scss';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';

interface GraphProps {
  pathway: Pathway;
  interactive?: boolean;
  expandCurrentNode?: boolean;
}

interface ExpandedState {
  [key: string]: boolean | string | null;
}

const Graph: FC<GraphProps> = memo(({ pathway, interactive = true, expandCurrentNode = true }) => {
  const graphElement = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<{ [key: string]: HTMLDivElement }>({});
  const [parentWidth, setParentWidth] = useState<number>(
    graphElement?.current?.parentElement?.clientWidth ?? 0
  );

  // Get the layout of the graph
  const getGraphLayout = useCallback((): Layout => {
    const nodeDimensions: NodeDimensions = {};

    // Retrieve dimensions from nodeRefs
    if (nodeRefs?.current) {
      Object.keys(nodeRefs.current).forEach(key => {
        const nodeElement = nodeRefs.current[key];
        const width = nodeElement.clientWidth;
        // nodeElement can have multiple children so calculate the sum to get the node height
        const height = Array.from(nodeElement.children).reduce(
          (acc, child) => acc + child.clientHeight,
          0
        );

        nodeDimensions[key] = { width, height };
      });
    }

    return graphLayout(pathway, nodeDimensions);
  }, [pathway]);

  const [layout, setLayout] = useState(getGraphLayout());
  const { nodeCoordinates, edges } = layout;
  const maxHeight = useMemo(() => {
    return nodeCoordinates !== undefined
      ? Object.values(nodeCoordinates)
          .map(x => x.y)
          .reduce((a, b) => Math.max(a, b))
      : 0;
  }, [nodeCoordinates]);

  // If a node has a negative x value, shift nodes and edges to the right by that value
  const minX =
    nodeCoordinates !== undefined
      ? Object.values(nodeCoordinates)
          .map(x => x.x + parentWidth / 2)
          .reduce((a, b) => Math.min(a, b))
      : 0;

  if (minX < 0) {
    const toAdd = minX * -1;
    Object.keys(nodeCoordinates).forEach(key => {
      const node = nodeCoordinates[key];
      node.x += toAdd;
    });

    Object.keys(edges).forEach(key => {
      const edge = edges[key];

      edge.points.forEach(p => (p.x += toAdd));
      if (edge.label) edge.label.x += toAdd;
    });
  }

  const [expanded, setExpanded] = useState<ExpandedState>(() =>
    Object.keys(layout).reduce(
      (acc, curr: string) => {
        acc[curr] = false;
        return acc;
      },
      { lastSelectedNode: null } as ExpandedState
    )
  );

  const toggleExpanded = useCallback((key: string) => {
    setExpanded(prevState => ({
      ...prevState,
      [key]:
        !prevState[key] || prevState.lastSelectedNode === key ? !prevState[key] : prevState[key],
      lastSelectedNode: key
    }));
  }, []);

  // Recalculate graph layout if graph container size changes
  useEffect(() => {
    if (graphElement.current?.parentElement) {
      new ResizeSensor(graphElement.current.parentElement, function() {
        setParentWidth(graphElement.current?.parentElement?.clientWidth ?? 0);
        setLayout(getGraphLayout());
      });
    }
  }, [getGraphLayout]);

  // Recalculate graph layout if a node is expanded
  useEffect(() => {
    setLayout(getGraphLayout());
  }, [pathway, expanded, getGraphLayout]);

  // maxWidth finds the edge label that is farthest to the right
  const maxWidth: number =
    edges !== undefined
      ? Object.values(edges)
          .map(e => e.label)
          .map(l => (l ? l.x + l.text.length * 10 + parentWidth / 2 : 0))
          .reduce((a, b) => Math.max(a, b), 0)
      : parentWidth;

  return (
    <GraphMemo
      graphElement={graphElement}
      interactive={interactive}
      maxHeight={maxHeight}
      nodeCoordinates={nodeCoordinates}
      edges={edges}
      pathway={pathway}
      nodeRefs={nodeRefs}
      parentWidth={parentWidth}
      maxWidth={maxWidth}
      expanded={expanded}
      toggleExpanded={toggleExpanded}
    />
  );
});

interface GraphMemoProps {
  graphElement: RefObject<HTMLDivElement>;
  interactive: boolean;
  maxHeight: number;
  nodeCoordinates: NodeCoordinates;
  edges: Edges;
  pathway: Pathway;
  nodeRefs: React.MutableRefObject<{
    [key: string]: HTMLDivElement;
  }>;
  parentWidth: number;
  maxWidth: number;
  expanded: ExpandedState;
  toggleExpanded: (key: string) => void;
}

const GraphMemo: FC<GraphMemoProps> = memo(
  ({
    graphElement,
    interactive,
    maxHeight,
    nodeCoordinates,
    edges,
    pathway,
    nodeRefs,
    parentWidth,
    maxWidth,
    expanded,
    toggleExpanded
  }) => {
    const { id: pathwayId } = useParams();
    const history = useHistory();
    const redirectToNode = useCallback(
      nodeId => {
        const url = `/builder/${encodeURIComponent(pathwayId)}/node/${encodeURIComponent(nodeId)}`;
        if (url !== history.location.pathname) {
          history.push(url);
        }
      },
      [history, pathwayId]
    );
    const onClickHandler = useCallback(
      (nodeName: string) => {
        if (interactive) {
          redirectToNode(nodeName);
          toggleExpanded(nodeName);
        }
      },
      [redirectToNode, toggleExpanded, interactive]
    );

    return (
      <div
        ref={graphElement}
        id="graph-root"
        className={styles.root}
        style={{
          height: interactive ? maxHeight + 150 : 'inherit',
          width: maxWidth + 'px',
          position: 'relative',
          marginRight: '5px'
        }}
      >
        {nodeCoordinates !== undefined
          ? Object.keys(nodeCoordinates).map(nodeName => {
              return (
                <Node
                  key={nodeName}
                  name={nodeName}
                  ref={(node: HTMLDivElement): void => {
                    if (node) nodeRefs.current[nodeName] = node;
                  }}
                  pathwayState={pathway.states[nodeName]}
                  isCurrentNode={false}
                  xCoordinate={nodeCoordinates[nodeName].x + parentWidth / 2}
                  yCoordinate={nodeCoordinates[nodeName].y}
                  expanded={Boolean(expanded[nodeName])}
                  onClick={onClickHandler}
                />
              );
            })
          : []}

        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{
            // Adding 5 pixels to maxWidth so that the rightmost edge label is not cut off
            width: maxWidth + 5,
            height: maxHeight,
            zIndex: 1,
            top: 0,
            left: 0,
            overflow: 'visible'
          }}
        >
          {edges !== undefined
            ? Object.keys(edges).map(edgeName => {
                const edge = edges[edgeName];
                return (
                  <Arrow
                    key={edgeName}
                    edge={edge}
                    edgeName={edgeName}
                    widthOffset={parentWidth / 2}
                  />
                );
              })
            : []}
        </svg>
      </div>
    );
  }
);

export default Graph;
