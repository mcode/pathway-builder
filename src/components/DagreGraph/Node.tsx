import React, { FC, memo, useCallback, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { useLifecycles, useUpdateEffect } from 'react-use';

import { ActionNode, BranchNode, PathwayNode, Transition } from 'pathways-model';
import { getNodeType } from 'utils/builder';
import NodeDetails from './NodeDetails';
import { useGraphProvider } from './GraphProvider';
import NodeIcon from './NodeIcon';
import useStyles from './Node.styles';

interface NodeProps {
  nodeKey: string;
  pathwayNode: ActionNode | BranchNode | PathwayNode;
  isActionable: boolean;
  isExpanded: boolean;
  onClick?: (nodeName: string) => void;
  xCoordinate: number;
  yCoordinate: number;
  openNode: (nodeName: string) => void;
}

interface BoundingClientRectResponse {
  width: number;
  height: number;
}

const createTransitionLabel = ({ condition }: Transition): { [key: string]: string | number } =>
  condition
    ? {
        label: condition.description,
        width: 25,
        height: 20
      }
    : {};

const getBoundingClientRect = (element: HTMLDivElement | null): BoundingClientRectResponse => {
  const dimensions = element?.getBoundingClientRect() ?? { width: 0, height: 0 };
  return { width: Math.ceil(dimensions.width), height: Math.ceil(dimensions.height) };
};

const Node: FC<NodeProps> = ({
  nodeKey,
  pathwayNode,
  isActionable,
  isExpanded,
  onClick,
  xCoordinate,
  yCoordinate,
  openNode
}) => {
  const styles = useStyles({ isExpanded, isActionable });
  const onClickHandler = useCallback(() => {
    if (onClick) onClick(nodeKey);
  }, [onClick, nodeKey]);
  const nodeRef = useRef<HTMLDivElement>(null);
  const { graph, reflow } = useGraphProvider();
  const nodeStyle = useMemo(() => ({ top: `${yCoordinate}px`, left: `${xCoordinate}px` }), [
    xCoordinate,
    yCoordinate
  ]);
  const nodeType = getNodeType(pathwayNode);
  const action = (pathwayNode as ActionNode).action;

  const { label, transitions } = pathwayNode;

  useLifecycles(
    (): void => {
      const { width, height } = getBoundingClientRect(nodeRef.current);
      graph.setNode(nodeKey, {
        width,
        height
      });
      transitions.forEach(transition => {
        graph.setEdge(nodeKey, transition.transition, createTransitionLabel(transition));
      });
    },
    (): void => {
      graph.removeNode(nodeKey);
    }
  );

  useUpdateEffect(() => {
    if (!nodeRef.current) return undefined;

    const { width, height } = getBoundingClientRect(nodeRef.current);
    const node = graph.node(nodeKey);

    if (node.width !== width || node.height !== height) {
      graph.setNode(nodeKey, {
        ...node,
        width,
        height
      });
      reflow();
    }
  });

  useUpdateEffect(() => {
    // remove transitions that no longer exist
    const transitionNodes = new Set(transitions.map(({ transition }) => transition));
    graph.outEdges(nodeKey)?.forEach(({ w }) => {
      if (!transitionNodes.has(w)) {
        graph.removeEdge(nodeKey, w);
      }
    });

    transitions.forEach(transition => {
      graph.setEdge(nodeKey, transition.transition, createTransitionLabel(transition));
    });
    reflow();
  }, [nodeKey, transitions]);

  useUpdateEffect(() => {
    if (!action) return;
    openNode(nodeKey);
  }, [action, nodeKey]);

  return (
    <div className={styles.node} style={nodeStyle} ref={nodeRef}>
      <div className={clsx(styles.nodeTitle, onClick && styles.clickable)} onClick={onClickHandler}>
        <NodeIcon
          resourceType={action ? action.resource?.resourceType : undefined}
          nodeType={nodeType}
          isStartNode={pathwayNode.label === 'Start'}
        />
        {label}
      </div>

      {isExpanded && (
        <div className={styles.nodeContent}>
          <NodeDetails pathwayNode={pathwayNode} />
        </div>
      )}
    </div>
  );
};

export default memo(Node);
