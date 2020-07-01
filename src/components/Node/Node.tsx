import React, { FC, Ref, forwardRef, memo, useCallback, useState, useEffect } from 'react';
import { PathwayActionNode, PathwayNode, Pathway } from 'pathways-model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Node.module.scss';
import ExpandedNode from 'components/ExpandedNode';
import { isActionNode, isBranchNode } from 'utils/nodeUtils';
import { getNodeType } from 'utils/builder';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faMicroscope,
  faPlay,
  faPrescriptionBottleAlt,
  faSyringe,
  faCheckCircle,
  faTimesCircle,
  faBookMedical
} from '@fortawesome/free-solid-svg-icons';

interface NodeProps {
  nodeKey: string;
  pathwayNode: PathwayNode;
  pathway: Pathway;
  xCoordinate: number;
  yCoordinate: number;
  expanded?: boolean;
  onClick?: (nodeKey: string) => void;
  currentNode: PathwayNode;
}

const Node: FC<NodeProps & { ref: Ref<HTMLDivElement> }> = memo(
  forwardRef<HTMLDivElement, NodeProps>(
    (
      {
        nodeKey,
        pathwayNode,
        pathway,
        xCoordinate,
        yCoordinate,
        expanded = false,
        onClick,
        currentNode
      },
      ref
    ) => {
      const [hasMetadata, setHasMetadata] = useState<boolean>(
        isActionNode(pathwayNode) ? pathwayNode.action.length > 0 : false
      );

      const onClickHandler = useCallback(() => {
        if (onClick) onClick(nodeKey);
      }, [onClick, nodeKey]);

      useEffect(() => {
        if (!hasMetadata && isActionNode(pathwayNode) && pathwayNode.action.length > 0) {
          setHasMetadata(true);
          if (!expanded) {
            onClickHandler();
          }
        }
      }, [hasMetadata, pathwayNode, setHasMetadata, onClickHandler, expanded]);

      const { label } = pathwayNode;
      const style = {
        top: yCoordinate,
        left: xCoordinate
      };

      const isCurrentNode = pathwayNode.key === currentNode.key;
      const isTransitionOfCurrentBranch =
        isBranchNode(currentNode) && currentNode.transitions.some(e => e?.transition === nodeKey);

      const isActionable = isCurrentNode;
      const topLevelClasses = [styles.node];
      let expandedNodeClass = '';
      if (expanded) topLevelClasses.push('expanded');
      if (isActionable || isTransitionOfCurrentBranch) {
        topLevelClasses.push(styles.actionable);
        expandedNodeClass = styles.childActionable;
      } else {
        expandedNodeClass = styles.childNotActionable;
      }
      const isAction = isActionNode(pathwayNode);
      const nodeType = getNodeType(pathway, nodeKey);
      return (
        <div className={topLevelClasses.join(' ')} style={style} ref={ref}>
          <div className={`nodeTitle ${onClickHandler && 'clickable'}`} onClick={onClickHandler}>
            <div className="iconAndLabel">
              <NodeIcon pathwayNode={pathwayNode} nodeType={nodeType} />
              {label}
            </div>
            <StatusIcon status={null} />
          </div>
          {expanded && (
            <div className={`${styles.expandedNode} ${expandedNodeClass}`}>
              <ExpandedNode
                pathwayNode={pathwayNode as PathwayActionNode}
                isActionable={isActionable}
                isAction={isAction}
              />
            </div>
          )}
        </div>
      );
    }
  )
);

interface NodeIconProps {
  pathwayNode: PathwayNode;
  nodeType: string;
}

const NodeIcon: FC<NodeIconProps> = ({ pathwayNode, nodeType }) => {
  let icon: IconDefinition | undefined;
  if (pathwayNode.label === 'Start') icon = faPlay;
  else if (nodeType === 'action') {
    const guidancePathwayNode = pathwayNode as PathwayActionNode;
    if (guidancePathwayNode.action.length > 0) {
      const resourceType = guidancePathwayNode.action[0].resource.resourceType;
      if (resourceType === 'MedicationRequest') icon = faPrescriptionBottleAlt;
      else if (resourceType === 'ServiceRequest') icon = faSyringe;
      else if (resourceType === 'CarePlan') icon = faBookMedical;
    }
  } else if (nodeType === 'branch') {
    icon = faMicroscope;
  }

  return icon ? <FontAwesomeIcon icon={icon} className={styles.icon} /> : null;
};

interface StatusIconProps {
  status: boolean | null;
}

const StatusIcon: FC<StatusIconProps> = ({ status }) => {
  if (status == null) {
    return null;
  }
  const icon = status ? faCheckCircle : faTimesCircle;
  return (
    <div className="statusIcon">
      <FontAwesomeIcon icon={icon} className={styles.icon} />
    </div>
  );
};

export default Node;
