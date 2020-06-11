import React, { FC, Ref, forwardRef, memo, useCallback } from 'react';
import { GuidanceState, State } from 'pathways-model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Node.module.scss';
import ExpandedNode from 'components/ExpandedNode';
import { isGuidanceState } from 'utils/nodeUtils';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faMicroscope,
  faPlay,
  faPrescriptionBottleAlt,
  faCapsules,
  faSyringe,
  faCheckCircle,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';

interface NodeProps {
  name: string;
  pathwayState: State;
  isCurrentNode: boolean;
  xCoordinate: number;
  yCoordinate: number;
  expanded?: boolean;
  onClick?: (nodeName: string) => void;
  isChoiceOfCurrent: boolean;
}

const Node: FC<NodeProps & { ref: Ref<HTMLDivElement> }> = memo(
  forwardRef<HTMLDivElement, NodeProps>(
    (
      {
        name,
        pathwayState,
        isCurrentNode,
        xCoordinate,
        yCoordinate,
        expanded = false,
        onClick,
        isChoiceOfCurrent
      },
      ref
    ) => {
      const onClickHandler = useCallback(() => {
        if (onClick) onClick(name);
      }, [onClick, name]);

      const { label } = pathwayState;
      const style = {
        top: yCoordinate,
        left: xCoordinate
      };

      const isActionable = isCurrentNode;
      const topLevelClasses = [styles.node];
      let expandedNodeClass = '';
      if (expanded) topLevelClasses.push('expanded');
      if (isActionable || isChoiceOfCurrent) {
        topLevelClasses.push(styles.actionable);
        expandedNodeClass = styles.childActionable;
      } else {
        expandedNodeClass = styles.childNotActionable;
      }
      const isGuidance = isGuidanceState(pathwayState);

      return (
        <div className={topLevelClasses.join(' ')} style={style} ref={ref}>
          <div className={`nodeTitle ${onClickHandler && 'clickable'}`} onClick={onClickHandler}>
            <div className="iconAndLabel">
              <NodeIcon pathwayState={pathwayState} isGuidance={isGuidance} />
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
  isGuidance: boolean;
}

const NodeIcon: FC<NodeIconProps> = ({ pathwayState, isGuidance }) => {
  let icon: IconProp = faMicroscope;
  if (pathwayState.key === 'Start') icon = faPlay;
  if (isGuidance) {
    const guidancePathwayState = pathwayState as GuidanceState;
    if (guidancePathwayState.action.length > 0) {
      const resourceType = guidancePathwayState.action[0].resource.resourceType;
      if (resourceType === 'MedicationRequest') icon = faPrescriptionBottleAlt;
      else if (resourceType === 'MedicationAdministration') icon = faCapsules;
      else if (resourceType === 'Procedure') icon = faSyringe;
    }
  }
  return <FontAwesomeIcon icon={icon} className={styles.icon} />;
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
