import React, { FC, ReactNode, ReactElement, memo } from 'react';
import { ActionNode } from 'pathways-model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ExpandedNode.module.scss';
import { isBranchNode, resourceNameConversion, isActionNode } from 'utils/nodeUtils';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { MedicationRequest, ServiceRequest } from 'fhir-objects';

interface ExpandedNodeProps {
  actionNode: ActionNode;
}

const ExpandedNode: FC<ExpandedNodeProps> = memo(({ actionNode }) => {
  return (
    <>
      <ExpandedNodeMemo actionNode={actionNode} />
    </>
  );
});

type ExpandedNodeFieldProps = {
  title: string;
  description: ReactNode;
};

const ExpandedNodeField: FC<ExpandedNodeFieldProps> = ({ title, description }) => {
  if (!description) return null;

  return (
    <tr>
      <td className={styles.descTitle}>{title}</td>
      <td className={styles.desc}>{description}</td>
    </tr>
  );
};

function isMedicationRequest(
  request: MedicationRequest | ServiceRequest
): request is MedicationRequest {
  return (request as MedicationRequest).medicationCodeableConcept !== undefined;
}

function renderAction(actionNode: ActionNode): ReactElement[] {
  let returnElements: ReactElement[] = [];
  if (actionNode.action[0]) {
    const resource = actionNode.action[0].resource;
    const coding = isMedicationRequest(resource)
      ? resource?.medicationCodeableConcept?.coding
      : resource?.code?.coding;

    const resourceType = resourceNameConversion[resource.resourceType]
      ? resourceNameConversion[resource.resourceType]
      : resource.resourceType;
    returnElements = [
      <ExpandedNodeField
        key="Description"
        title="Description"
        description={actionNode.action[0].description}
      />,
      <ExpandedNodeField key="Type" title="Type" description={resourceType} />,
      <ExpandedNodeField
        key="System"
        title="System"
        description={
          coding &&
          coding[0].system && (
            <>
              {coding[0].system}
              <a href={coding[0].system} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faExternalLinkAlt} className={styles.externalLink} />
              </a>
            </>
          )
        }
      />,
      <ExpandedNodeField key="Code" title="Code" description={coding && coding[0].code} />,
      <ExpandedNodeField key="Display" title="Display" description={coding && coding[0].display} />,
      <ExpandedNodeField key="Title" title="Title" description={resource.title} />
    ];
  }

  return returnElements;
}

function renderBranch(): ReactElement {
  return <ExpandedNodeField key="Type" title="Type" description="Observation" />;
}

interface ExpandedNodeMemoProps {
  actionNode: ActionNode;
}

const ExpandedNodeMemo: FC<ExpandedNodeMemoProps> = memo(({ actionNode }) => {
  const action = isActionNode(actionNode) && renderAction(actionNode);
  const branch = isBranchNode(actionNode) && renderBranch();
  return (
    <div className="expandedNode">
      <table className={styles.infoTable}>
        <tbody>{action || branch}</tbody>
      </table>
    </div>
  );
});

export default ExpandedNode;
