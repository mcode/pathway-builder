import React, { FC, useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import graphLayout from 'visualization/layout';
import Node from 'components/Node';
import Arrow from 'components/Arrow';
import { useBuildCriteriaContext } from 'components/BuildCriteriaProvider';
import { Pathway, PathwayNode } from 'pathways-model';
import { Layout, NodeDimensions, NodeCoordinates, Edges } from 'graph-model';
import styles from './Graph.module.scss';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';
import { useCurrentNodeContext } from 'components/CurrentNodeProvider';
import { getNodeType } from 'utils/builder';

interface GraphProps {
  graphContainerWidth: number;
  interactive?: boolean;
}

interface ExpandedNode {
  [key: string]: boolean | string | null;
}

const Graph: FC<GraphProps> = memo(function Graph({ graphContainerWidth, interactive = true }) {
  const { pathway } = useCurrentPathwayContext();
  const { currentNode } = useCurrentNodeContext();
  const nodeRefs = useRef<{ [key: string]: HTMLDivElement }>({});

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

    if (pathway) return graphLayout(pathway, nodeDimensions);
    else return {} as Layout;
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
          .map(x => x.x + graphContainerWidth / 2)
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

  // Find node that is farthest to the right
  const maxWidth = useMemo(() => {
    return nodeCoordinates !== undefined
      ? Object.values(nodeCoordinates)
          // Add width of the node to account for x coordinate starting at top left corner
          .map(x => x.x + graphContainerWidth / 2 + (x.width ?? 0))
          .reduce((a, b) => Math.max(a, b))
      : 0;
  }, [nodeCoordinates, graphContainerWidth]);

  const [expanded, setExpanded] = useState<ExpandedNode>(() =>
    Object.keys(layout).reduce(
      (acc, curr: string) => {
        acc[curr] = false;
        return acc;
      },
      { lastSelectedNode: null } as ExpandedNode
    )
  );

  const toggleExpanded = useCallback((key: string) => {
    if (key === 'Start') {
      setExpanded(prevState => ({
        ...prevState,
        lastSelectedNode: key
      }));
    } else {
      setExpanded(prevState => ({
        ...prevState,
        [key]:
          !prevState[key] || prevState.lastSelectedNode === key ? !prevState[key] : prevState[key],
        lastSelectedNode: key
      }));
    }
  }, []);

  // Recalculate graph layout if a node is expanded
  useEffect(() => {
    setLayout(getGraphLayout());
  }, [pathway, expanded, getGraphLayout]);

  if (!pathway) return <div>Error: No pathway loaded</div>;
  else if (!currentNode) return <div>Error: No node selected</div>;
  else
    return (
      <GraphMemo
        interactive={interactive}
        maxHeight={maxHeight}
        nodeCoordinates={nodeCoordinates}
        edges={edges}
        pathway={pathway}
        nodeRefs={nodeRefs}
        parentWidth={graphContainerWidth}
        maxWidth={maxWidth}
        expanded={expanded}
        toggleExpanded={toggleExpanded}
        currentNode={currentNode}
      />
    );
});

interface GraphMemoProps {
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
  expanded: ExpandedNode;
  toggleExpanded: (key: string) => void;
  currentNode: PathwayNode;
}

const GraphMemo: FC<GraphMemoProps> = memo(function GraphMemo({
  interactive,
  maxHeight,
  nodeCoordinates,
  edges,
  pathway,
  nodeRefs,
  parentWidth,
  maxWidth,
  expanded,
  toggleExpanded,
  currentNode
}) {
  const { id: pathwayId } = useParams();
  const history = useHistory();
  const { updateBuildCriteriaNodeId } = useBuildCriteriaContext();
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
    (nodeKey: string) => {
      if (interactive) {
        redirectToNode(nodeKey);
        toggleExpanded(nodeKey);
        updateBuildCriteriaNodeId('');
      }
    },
    [redirectToNode, toggleExpanded, updateBuildCriteriaNodeId, interactive]
  );

  return (
    <div
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
        ? Object.keys(nodeCoordinates).map(nodeKey => {
            if (Object.keys(pathway.nodes).includes(nodeKey)) {
              return (
                <Node
                  key={nodeKey}
                  nodeKey={nodeKey}
                  ref={(node: HTMLDivElement): void => {
                    if (node) nodeRefs.current[nodeKey] = node;
                    else delete nodeRefs.current[nodeKey];
                  }}
                  pathwayNode={pathway.nodes[nodeKey]}
                  xCoordinate={nodeCoordinates[nodeKey].x + parentWidth / 2}
                  yCoordinate={nodeCoordinates[nodeKey].y}
                  expanded={Boolean(expanded[nodeKey])}
                  onClick={onClickHandler}
                  nodeType={getNodeType(pathway, nodeKey)}
                />
              );
            } else return null;
          })
        : []}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: maxWidth + 100,
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
                  currentNode={currentNode}
                />
              );
            })
          : []}
      </svg>
    </div>
  );
});

export default Graph;
