import React, { FC, Ref, forwardRef, memo, useCallback, useState, useEffect } from 'react';
import { GuidanceState, State, Pathway } from 'pathways-model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Node.module.scss';
import ExpandedNode from 'components/ExpandedNode';
import { isGuidanceState, isBranchState } from 'utils/nodeUtils';
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
  pathwayState: State;
  pathway: Pathway;
  xCoordinate: number;
  yCoordinate: number;
  expanded?: boolean;
  onClick?: (nodeName: string) => void;
  currentNode: State;
}

const Node: FC<NodeProps & { ref: Ref<HTMLDivElement> }> = memo(
  forwardRef<HTMLDivElement, NodeProps>(
    (
      {
        nodeKey,
        pathwayState,
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
        isGuidanceState(pathwayState) ? pathwayState.action.length > 0 : false
      );

      const onClickHandler = useCallback(() => {
        if (onClick) onClick(nodeKey);
      }, [onClick, nodeKey]);

      useEffect(() => {
        if (!hasMetadata && isGuidanceState(pathwayState) && pathwayState.action.length > 0) {
          setHasMetadata(true);
          if (!expanded) {
            onClickHandler();
          }
        }
      }, [hasMetadata, pathwayState, setHasMetadata, onClickHandler, expanded]);

      const { label } = pathwayState;
      const style = {
        top: yCoordinate,
        left: xCoordinate
      };

      const isCurrentNode = pathwayState.key === currentNode.key;
      const isTransitionOfCurrentBranch =
        isBranchState(currentNode) && currentNode.transitions.some(e => e?.transition === nodeKey);

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
      const isGuidance = isGuidanceState(pathwayState);
      const nodeType = getNodeType(pathway, nodeKey);
      return (
        <div className={topLevelClasses.join(' ')} style={style} ref={ref}>
          <div className={`nodeTitle ${onClickHandler && 'clickable'}`} onClick={onClickHandler}>
            <div className="iconAndLabel">
              <NodeIcon pathwayState={pathwayState} nodeType={nodeType} />
              {label}
            </div>
            <StatusIcon status={null} />
          </div>
          {expanded && (
            <div className={`${styles.expandedNode} ${expandedNodeClass}`}>
              <ExpandedNode
                pathwayState={pathwayState as GuidanceState}
                isActionable={isActionable}
                isGuidance={isGuidance}
              />
            </div>
          )}
        </div>
      );
    }
  )
);

interface NodeIconProps {
  pathwayState: State;
  nodeType: string;
}

const NodeIcon: FC<NodeIconProps> = ({ pathwayState, nodeType }) => {
  let icon: IconDefinition | undefined;
  if (pathwayState.key === 'Start') icon = faPlay;
  else if (nodeType === 'action') {
    const guidancePathwayState = pathwayState as GuidanceState;
    if (guidancePathwayState.action.length > 0) {
      const resourceType = guidancePathwayState.action[0].resource.resourceType;
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
