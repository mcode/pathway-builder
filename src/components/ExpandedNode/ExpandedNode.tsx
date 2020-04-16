import React, { FC, ReactNode, ReactElement, memo } from 'react';
import { GuidanceState, DocumentationResource, State } from 'pathways-model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MissingDataPopup from 'components/MissingDataPopup';
import styles from './ExpandedNode.module.scss';
import indexStyles from 'styles/index.module.scss';
import { isBranchState } from 'utils/nodeUtils';

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

import {
  MedicationRequest,
  ServiceRequest
} from 'fhir-objects';
interface ExpandedNodeProps {
  pathwayState: GuidanceState;
  isActionable: boolean;
  isGuidance: boolean;
  documentation: DocumentationResource | undefined;
}

const ExpandedNode: FC<ExpandedNodeProps> = memo(
  ({ pathwayState, isActionable, isGuidance, documentation }) => {
    return (
      <>
        <ExpandedNodeMemo
          isGuidance={isGuidance}
          pathwayState={pathwayState}
        />
      </>
    );
  }
);

type ExpandedNodeFieldProps = {
  title: string;
  description: ReactNode;
};

const ExpandedNodeField: FC<ExpandedNodeFieldProps> = ({ title, description }) => {
  return (
    <tr>
      <td className={styles.descTitle}>{title}</td>
      <td className={styles.desc}>{description}</td>
    </tr>
  );
};

function renderBranch(
  pathwayState: State
): ReactElement[] {
  const returnElements: ReactElement[] = [];

  const values: string[] = pathwayState.transitions
    .map(transition => {
      const description = transition.condition?.description;
      return description ? description : '';
    })
    // Remove duplicate values
    .filter((v, i, arr) => arr.indexOf(v) === i);

  returnElements.push(
    <ExpandedNodeField
      key="value"
      title="Value"
      description={<MissingDataPopup values={values} />}
    />
  );
  
  return returnElements;
}

function isMedicationRequest(
  request: MedicationRequest | ServiceRequest
): request is MedicationRequest {
  return (request as MedicationRequest).medicationCodeableConcept !== undefined;
}
function renderGuidance(
  pathwayState: GuidanceState
): ReactElement[] {
  const resource = pathwayState.action[0].resource;
  const coding = isMedicationRequest(resource)
    ? resource?.medicationCodeableConcept?.coding
    : resource?.code?.coding;

  const returnElements = [
    <ExpandedNodeField
      key="Notes"
      title="Notes"
      description={pathwayState.action[0].description}
    />,
    <ExpandedNodeField key="Type" title="Type" description={resource.resourceType} />,
    <ExpandedNodeField
      key="System"
      title="System"
      description={
        <>
          {coding && coding[0].system}
          <a href={coding && coding[0].system} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faExternalLinkAlt} className={styles.externalLink} />
          </a>
        </>
      }
    />,
    <ExpandedNodeField key="Code" title="Code" description={coding && coding[0].code} />,
    <ExpandedNodeField key="Display" title="Display" description={coding && coding[0].display} />
  ];

  return returnElements;
}

interface ExpandedNodeMemoProps {
  pathwayState: GuidanceState;
  isGuidance: boolean;
}
const ExpandedNodeMemo: FC<ExpandedNodeMemoProps> = memo(
  ({
    pathwayState,
    isGuidance
  }) => {
    const guidance = isGuidance && renderGuidance(pathwayState);
    const branch = isBranchState(pathwayState) && renderBranch(pathwayState);
    return (
      <div className={indexStyles.expandedNode}>
        <table className={styles.infoTable}>
          <tbody>
            {guidance || branch}
          </tbody>
        </table>
      </div>
    );
  }
);

export default ExpandedNode;
