import React from 'react';
import { render } from '@testing-library/react';
import ExpandedNode from 'components/ExpandedNode';
import { GuidanceState, BasicActionResource, BasicMedicationRequestResource } from 'pathways-model';
import { resourceNameConversion } from 'utils/nodeUtils';

const testActionState: GuidanceState = {
  label: 'Chemotherapy',
  action: [
    {
      type: 'create',
      description: 'Begin Chemotherapy procedure',
      resource: {
        resourceType: 'Procedure',
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '367336001',
              display: 'Chemotherapy (procedure)'
            }
          ],
          text: 'Chemotherapy (procedure)'
        }
      }
    }
  ],
  cql: 'Chemotherapy',
  transitions: []
};

const testMedicationRequestState: GuidanceState = {
  label: 'ChemoMedication Request',
  action: [
    {
      type: 'create',
      description: 'Request 10ML Doxorubicin Hydrochloride 2MG/ML Injection',
      resource: {
        resourceType: 'MedicationRequest',
        medicationCodeableConcept: {
          coding: [
            {
              system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
              code: '1790099',
              display: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection'
            }
          ],
          text: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection'
        }
      }
    }
  ],
  cql: 'DoxorubicinRequest',
  transitions: []
};

describe('<ExpandedNode />', () => {
  it('renders a ExpandedNode for action state', () => {
    const { getByText, queryByRole, queryByText } = render(
      <ExpandedNode
        pathwayState={testActionState}
        isActionable={false}
        isGuidance={true}
        documentation={undefined}
      />
    );

    const resource = testActionState.action[0].resource as BasicActionResource;

    const resourceType = resourceNameConversion[resource.resourceType]
      ? resourceNameConversion[resource.resourceType]
      : resource.resourceType;
    expect(getByText(testActionState.action[0].description)).toBeVisible();
    expect(getByText(resourceType)).toBeVisible();
    expect(getByText(resource.code.coding[0].system)).toBeVisible();
    expect(getByText(resource.code.coding[0].code)).toBeVisible();
    expect(getByText(resource.code.coding[0].display)).toBeVisible();

    // Form and buttons should not be displayed in an inactive ExpandedNode
    expect(queryByRole('form')).toBeNull();
    expect(queryByText('Accept')).toBeNull();
    expect(queryByText('Decline')).toBeNull();
    expect(queryByText('Use Default Text')).toBeNull();
  });

  it('renders a ExpandedNode for a medication request state', () => {
    const { getByText } = render(
      <ExpandedNode
        pathwayState={testMedicationRequestState}
        isActionable={false}
        isGuidance={true}
        documentation={undefined}
      />
    );

    const resource = testMedicationRequestState.action[0]
      .resource as BasicMedicationRequestResource;

    const resourceType = resourceNameConversion[resource.resourceType]
      ? resourceNameConversion[resource.resourceType]
      : resource.resourceType;
    expect(getByText(testMedicationRequestState.action[0].description)).toBeVisible();
    expect(getByText(resourceType)).toBeVisible();
    expect(getByText(resource.medicationCodeableConcept.coding[0].system)).toBeVisible();
    expect(getByText(resource.medicationCodeableConcept.coding[0].code)).toBeVisible();
    expect(getByText(resource.medicationCodeableConcept.coding[0].display)).toBeVisible();
  });
});
