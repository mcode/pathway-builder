import React, { FC, memo, useCallback } from 'react';
import { useUpdateEffect } from 'react-use';

import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';
import { useCurrentNodeContext } from 'components/CurrentNodeProvider';
import { useGraphCoordinates, useGraphProvider } from './GraphProvider';
import Node from './Node';
import useExpandedState from './useExpandedState';
import useRedirectToNode from './useRedirectToNode';

interface GraphNodesProps {
  interactive: boolean;
}

const GraphNodes: FC<GraphNodesProps> = ({ interactive }) => {
  const { pathway } = useCurrentPathwayContext();
  const { expanded: expandedNodes, toggleExpanded } = useExpandedState();
  const { reflow } = useGraphProvider();
  const { nodes: nodeCoordinates } = useGraphCoordinates();
  const { currentNode } = useCurrentNodeContext();
  const redirectToNode = useRedirectToNode();
  const onClick = useCallback(
    (nodeName: string) => {
      redirectToNode(nodeName);
      toggleExpanded(nodeName);
    },
    [redirectToNode, toggleExpanded]
  );

  const nodes = Object.entries(pathway?.nodes ?? {});

  useUpdateEffect(() => {
    reflow();
  }, [nodes.length]);

  return (
    <>
      {nodes.map(([nodeName, pathwayNode]) => {
        const coordinates = nodeCoordinates[nodeName];

        return (
          <Node
            key={nodeName}
            nodeKey={nodeName}
            pathwayNode={pathwayNode}
            isActionable={pathwayNode.key === currentNode?.key}
            isExpanded={Boolean(expandedNodes[nodeName])}
            onClick={interactive ? onClick : undefined}
            xCoordinate={coordinates?.x ?? 0}
            yCoordinate={coordinates?.y ?? 0}
          />
        );
      })}
    </>
  );
};

export default memo(GraphNodes);
