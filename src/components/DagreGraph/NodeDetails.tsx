import React, { FC, ReactNode, memo } from 'react';
import { ActionNode, BranchNode, PathwayNode, ReferenceNode } from 'pathways-model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

import { MedicationRequest, ServiceRequest } from 'fhir-objects';
import { getNodeType } from 'utils/builder';
import { resourceNameConversion } from 'utils/nodeUtils';
import useStyles from './NodeDetails.styles';

interface NodeDetailsProps {
  pathwayNode: ActionNode | BranchNode | PathwayNode;
}

interface FieldProps {
  title: string;
  description: string | ReactNode;
}

interface ActionNodeFieldsProps {
  actionNode: ActionNode;
}

interface ReferenceNodeProps {
  referenceNode: ReferenceNode;
}
const isMedicationRequest = (
  request: MedicationRequest | ServiceRequest
): request is MedicationRequest =>
  (request as MedicationRequest).medicationCodeableConcept !== undefined;

const Field: FC<FieldProps> = ({ title, description }) => {
  const styles = useStyles();

  if (!description) return null;

  return (
    <tr>
      <td className={styles.title}>{title}</td>
      <td className={styles.description}>{description}</td>
    </tr>
  );
};

const BranchNodeContents: FC = () => <Field title="Type" description="Observation" />;

const ActionNodeFields: FC<ActionNodeFieldsProps> = ({ actionNode }) => {
  const styles = useStyles();

  if (actionNode.action === null) return null;

  const resource = actionNode.action.resource;
  const coding = isMedicationRequest(resource)
    ? resource?.medicationCodeableConcept?.coding
    : resource?.code?.coding;
  const resourceType = resourceNameConversion[resource.resourceType]
    ? resourceNameConversion[resource.resourceType]
    : resource.resourceType;

  return (
    <>
      <Field title="Description" description={actionNode.action.description} />
      <Field key="Type" title="Type" description={resourceType} />
      <Field
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
      <Field key="Code" title="Code" description={coding?.[0]?.code} />
      <Field key="Display" title="Display" description={coding?.[0]?.display} />
      <Field key="Title" title="Title" description={resource.title} />
    </>
  );
};

const ReferenceNodeFields: FC<ReferenceNodeProps> = ({ referenceNode }) => (
  <>
    <Field title="Type" description="Reference" />
    <Field title="Pathway" description={referenceNode.referenceLabel} />
  </>
);

const NodeDetails: FC<NodeDetailsProps> = ({ pathwayNode }) => {
  const styles = useStyles();
  const nodeType = getNodeType(pathwayNode);

  if (nodeType == null) return null;

  return (
    <table className={styles.table}>
      <tbody>
        {nodeType === 'branch' && <BranchNodeContents />}
        {nodeType === 'reference' && (
          <ReferenceNodeFields referenceNode={pathwayNode as ReferenceNode} />
        )}
        {nodeType === 'action' && <ActionNodeFields actionNode={pathwayNode as ActionNode} />}
      </tbody>
    </table>
  );
};

export default memo(NodeDetails);
