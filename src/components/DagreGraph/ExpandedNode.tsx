import React, { FC, ReactNode, memo } from 'react';
import { ActionNode, BranchNode, PathwayNode } from 'pathways-model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

import { MedicationRequest, ServiceRequest } from 'fhir-objects';
import { resourceNameConversion } from 'utils/nodeUtils';

interface ExpandedNodeProps {
  pathwayNode: ActionNode | BranchNode | PathwayNode;
  nodeType: string;
}

interface ExpandedNodeFieldProps {
  title: string;
  description: string | ReactNode;
}

interface ActionNodeFieldsProps {
  actionNode: ActionNode;
}

const useStyles = makeStyles(
  (theme: AugmentedTheme) => ({
    table: {
      '& tr': {
        verticalAlign: 'top'
      }
    },
    title: {
      fontWeight: 'bold',
      textAlign: 'right',
      minWidth: '80px'
    },
    description: {
      paddingLeft: theme.spacing(2),
      fontStyle: 'italic',
      overflowWrap: 'break-word'
    },
    externalLink: {
      color: theme.palette.common.blue,
      marginLeft: theme.spacing(1),

      '&:hover, &:focus': {
        color: theme.palette.common.grayDark
      }
    }
  }),
  { name: 'ExpandedNode' }
);

const isMedicationRequest = (
  request: MedicationRequest | ServiceRequest
): request is MedicationRequest =>
  (request as MedicationRequest).medicationCodeableConcept !== undefined;

const ExpandedNodeField: FC<ExpandedNodeFieldProps> = ({ title, description }) => {
  const styles = useStyles();

  if (!description) return null;

  return (
    <tr>
      <td className={styles.title}>{title}</td>
      <td className={styles.description}>{description}</td>
    </tr>
  );
};

const BranchNodeContents: FC = () => <ExpandedNodeField title="Type" description="Observation" />;

const ActionNodeFields: FC<ActionNodeFieldsProps> = ({ actionNode }) => {
  const styles = useStyles();

  if (actionNode.action?.[0] == null) return null;

  const resource = actionNode.action[0].resource;
  const coding = isMedicationRequest(resource)
    ? resource?.medicationCodeableConcept?.coding
    : resource?.code?.coding;
  const resourceType = resourceNameConversion[resource.resourceType]
    ? resourceNameConversion[resource.resourceType]
    : resource.resourceType;

  return (
    <>
      <ExpandedNodeField title="Description" description={actionNode.action[0].description} />
      <ExpandedNodeField key="Type" title="Type" description={resourceType} />
      <ExpandedNodeField
        key="System"
        title="System"
        description={
          coding?.[0]?.system && (
            <>
              {coding[0].system}
              <a href={coding[0].system} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faExternalLinkAlt} className={styles.externalLink} />
              </a>
            </>
          )
        }
      />
      <ExpandedNodeField key="Code" title="Code" description={coding?.[0]?.code} />
      <ExpandedNodeField key="Display" title="Display" description={coding?.[0]?.display} />
      <ExpandedNodeField key="Title" title="Title" description={resource.title} />
    </>
  );
};

const ExpandedNode: FC<ExpandedNodeProps> = ({ pathwayNode, nodeType }) => {
  const styles = useStyles();

  return (
    <table className={styles.table}>
      <tbody>
        {nodeType === 'branch' && <BranchNodeContents />}
        {nodeType === 'action' && <ActionNodeFields actionNode={pathwayNode as ActionNode} />}
      </tbody>
    </table>
  );
};

export default memo(ExpandedNode);
