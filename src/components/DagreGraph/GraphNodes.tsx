import React, { FC, memo, useCallback } from 'react';
import { useUpdateEffect } from 'react-use';

import { useCurrentCriteriaContext } from 'components/CurrentCriteriaProvider';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';
import { useGraphCoordinates, useGraphProvider } from './GraphProvider';
import Node from './Node';
import useExpandedState from './useExpandedState';
import useRedirectToNode from './useRedirectToNode';
import { PathwayNode } from 'pathways-model';

interface GraphNodesProps {
  interactive: boolean;
  currentNode: PathwayNode | null;
}

const GraphNodes: FC<GraphNodesProps> = ({ interactive, currentNode }) => {
  const { pathway } = useCurrentPathwayContext();
  const { expanded: expandedNodes, toggleExpanded, openNode } = useExpandedState();
  const { reflow } = useGraphProvider();
  const { nodes: nodeCoordinates } = useGraphCoordinates();
  const redirectToNode = useRedirectToNode();
  const { resetCurrentCriteria } = useCurrentCriteriaContext();
  const onClick = useCallback(
    (nodeName: string) => {
      redirectToNode(nodeName);
      toggleExpanded(nodeName);
      resetCurrentCriteria();
    },
    [redirectToNode, toggleExpanded, resetCurrentCriteria]
  );

  const nodes = Object.entries(pathway?.nodes ?? {});

  useUpdateEffect(() => {
    reflow();
  }, [nodes.length]);

  return (
    <>
      {nodes.map(([nodeName, pathwayNode]) => {
        const coordinates = nodeCoordinates[nodeName] ?? { x: -999, y: -999 };

        return (
          <Node
            key={nodeName}
            nodeKey={nodeName}
            pathwayNode={pathwayNode}
            isActionable={pathwayNode.key === currentNode?.key}
            isExpanded={Boolean(expandedNodes[nodeName])}
            onClick={interactive ? onClick : undefined}
            xCoordinate={coordinates.x}
            yCoordinate={coordinates.y}
            openNode={openNode}
          />
        );
      })}
    </>
  );
};

export default memo(GraphNodes);
