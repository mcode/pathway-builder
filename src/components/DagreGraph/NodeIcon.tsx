import React, { FC, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faMicroscope,
  faPlay,
  faPrescriptionBottleAlt,
  faSyringe,
  faBookMedical
} from '@fortawesome/free-solid-svg-icons';
import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

interface NodeIconProps {
  isStartNode: boolean;
  nodeType: string;
  resourceType?: string;
}

const useStyles = makeStyles(
  (theme: AugmentedTheme) => ({
    icon: {
      marginRight: theme.spacing(1),
      fontSize: '0.9rem'
    }
  }),
  { name: 'DagreGraph-NodeIcon' }
);

const NodeIcon: FC<NodeIconProps> = ({ isStartNode, nodeType, resourceType }) => {
  const styles = useStyles();

  let icon: IconDefinition | undefined;
  if (isStartNode) {
    icon = faPlay;
  } else if (nodeType === 'action' && resourceType) {
    if (resourceType === 'MedicationRequest') icon = faPrescriptionBottleAlt;
    else if (resourceType === 'ServiceRequest') icon = faSyringe;
    else if (resourceType === 'CarePlan') icon = faBookMedical;
  } else if (nodeType === 'branch') {
    icon = faMicroscope;
  }

  return icon ? <FontAwesomeIcon icon={icon} className={styles.icon} /> : null;
};

export default memo(NodeIcon);
