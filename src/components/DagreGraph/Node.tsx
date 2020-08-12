import React, { FC, memo, useCallback, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { useLifecycles, useUpdateEffect } from 'react-use';
import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

import { ActionNode, BranchNode, PathwayNode, Transition } from 'pathways-model';
import { getNodeType } from 'utils/builder';
import ExpandedNode from './ExpandedNode';
import { useGraphProvider } from './GraphProvider';
import NodeIcon from './NodeIcon';

interface NodeProps {
  nodeKey: string;
  pathwayNode: ActionNode | BranchNode | PathwayNode;
  isActionable: boolean;
  isExpanded: boolean;
  onClick?: (nodeName: string) => void;
  xCoordinate: number;
  yCoordinate: number;
}

interface StyleProps {
  isActionable: boolean;
  isExpanded: boolean;
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

const useStyles = makeStyles(
  (theme: AugmentedTheme) => ({
    node: {
      position: 'absolute',
      width: 'auto',
      minWidth: ({ isExpanded }: StyleProps): string => (isExpanded ? '400px' : '100px'),
      minHeight: '50px',
      display: 'flex',
      alignItems: 'stretch',
      flexDirection: 'column',
      border: ({ isActionable }: StyleProps): string =>
        `1px solid ${theme.palette.common[isActionable ? 'red' : 'blue']}`,
      backgroundColor: theme.palette.common.white,
      zIndex: 2
    },
    nodeTitle: {
      padding: theme.spacing(2),
      flex: '1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.palette.common.white,
      backgroundColor: ({ isActionable }: StyleProps): string =>
        theme.palette.common[isActionable ? 'red' : 'blue']
    },
    nodeContent: {
      padding: theme.spacing(2)
    },
    clickable: {
      cursor: 'pointer'
    }
  }),
  { name: 'DagreGraph-Node' }
);

const Node: FC<NodeProps> = ({
  nodeKey,
  pathwayNode,
  isActionable,
  isExpanded,
  onClick,
  xCoordinate,
  yCoordinate
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
  const nodeType = useMemo(() => getNodeType(pathwayNode), [pathwayNode]);

  const { label, transitions } = pathwayNode;

  useLifecycles(
    (): void => {
      const { width, height } = getBoundingClientRect(nodeRef.current);
      graph.setNode(nodeKey, {
        label,
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

  return (
    <div className={styles.node} style={nodeStyle} ref={nodeRef}>
      <div className={clsx(styles.nodeTitle, onClick && styles.clickable)} onClick={onClickHandler}>
        <NodeIcon
          resourceType={(pathwayNode as ActionNode).action?.[0]?.resource?.resourceType}
          nodeType={nodeType}
          isStartNode={pathwayNode.label === 'Start'}
        />
        {label}
      </div>

      {isExpanded && (
        <div className={styles.nodeContent}>
          <ExpandedNode pathwayNode={pathwayNode} nodeType={nodeType} />
        </div>
      )}
    </div>
  );
};

export default memo(Node);
