import React from 'react';
import { render } from '@testing-library/react';
import { ActionNode, BasicActionResource, BasicMedicationRequestResource } from 'pathways-model';
import { resourceNameConversion } from 'utils/nodeUtils';
import NodeDetails from '../NodeDetails';

const testActionNode: ActionNode = {
  label: 'Chemotherapy',
  type: 'action',
  action: {
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
  },
  cql: 'Chemotherapy',
  transitions: []
};

const testMedicationRequestNode: ActionNode = {
  label: 'ChemoMedication Request',
  type: 'action',
  action: {
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
  },
  cql: 'DoxorubicinRequest',
  transitions: []
};

describe('<NodeDetails />', () => {
  it('renders an action node', () => {
    const { getByText, queryByRole, queryByText } = render(
      <NodeDetails pathwayNode={testActionNode} />
    );

    const resource = testActionNode.action.resource as BasicActionResource;

    const resourceType = resourceNameConversion[resource.resourceType]
      ? resourceNameConversion[resource.resourceType]
      : resource.resourceType;
    expect(getByText(testActionNode.action.description)).toBeVisible();
    expect(getByText(resourceType)).toBeVisible();
    expect(getByText(resource.code.coding[0].system)).toBeVisible();
    expect(getByText(resource.code.coding[0].code)).toBeVisible();
    expect(getByText(resource.code.coding[0].display)).toBeVisible();

    // Form and buttons should not be displayed in an inactive NodeDetails
    expect(queryByRole('form')).toBeNull();
    expect(queryByText('Accept')).toBeNull();
    expect(queryByText('Decline')).toBeNull();
    expect(queryByText('Use Default Text')).toBeNull();
  });

  it('renders a medication request node', () => {
    const { getByText } = render(<NodeDetails pathwayNode={testMedicationRequestNode} />);

    const resource = testMedicationRequestNode.action.resource as BasicMedicationRequestResource;

    const resourceType = resourceNameConversion[resource.resourceType]
      ? resourceNameConversion[resource.resourceType]
      : resource.resourceType;
    expect(getByText(testMedicationRequestNode.action.description)).toBeVisible();
    expect(getByText(resourceType)).toBeVisible();
    expect(getByText(resource.medicationCodeableConcept.coding[0].system)).toBeVisible();
    expect(getByText(resource.medicationCodeableConcept.coding[0].code)).toBeVisible();
    expect(getByText(resource.medicationCodeableConcept.coding[0].display)).toBeVisible();
  });
});
