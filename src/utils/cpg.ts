import { Action, ActionNode, Pathway } from 'pathways-model';
import {
  ActivityDefinition,
  PlanDefinition,
  PlanDefinitionAction,
  Bundle,
  BundleEntry,
  Library
} from 'fhir-objects';
import shortid from 'shortid';
import { isActionNode, findParents, isBranchNode } from './nodeUtils';
import { R4 } from '@ahryman40k/ts-fhir-types';

const LIBRARY_DRAFT = R4.LibraryStatusKind._draft;
const PLANDEFINITION_DRAFT = R4.PlanDefinitionStatusKind._draft;
const ACTIVITYDEFINITION_DRAFT = R4.ActivityDefinitionStatusKind._draft;
const BUNDLE_TRANSACTION = R4.BundleTypeKind._transaction;
const BUNDLE_POST = R4.Bundle_RequestMethodKind._post;
const CONDITION_APPLICABILITY = R4.PlanDefinition_ConditionKindKind._applicability; // eslint-disable-line
const EXPRESSION_CQL = R4.ExpressionLanguageKind._textCql;

function createActivityDefinition(action: Action): ActivityDefinition {
  const activityId = shortid.generate();
  const kind =
    action.resource.resourceType === 'Procedure' ? 'ServiceRequest' : action.resource.resourceType;

  const activityDefinition: ActivityDefinition = {
    id: activityId,
    resourceType: 'ActivityDefinition',
    meta: {
      profile: ['http://hl7.org/fhir/uv/cpg/StructureDefinition/cpg-publishableactivity']
    },
    extension: [
      {
        url:
          'http://build.fhir.org/ig/HL7/cqf-recommendations/StructureDefinition/cpg-knowledgeCapability.html',
        valueCode: 'publishable'
      }
    ],
    url: `urn:uuid:ActivityDefinition/${activityId}`,
    version: '1.0',
    name: activityId,
    title: `ActivityDefinition: ${activityId}`,
    status: ACTIVITYDEFINITION_DRAFT,
    experimental: true,
    date: new Date().toISOString(),
    publisher: 'Logged in user',
    description: action.description,
    kind: kind,
    productCodeableConcept:
      action.resource.resourceType === 'MedicationRequest'
        ? action.resource.medicationCodeableConcept
        : action.resource.code
  };

  return activityDefinition;
}

function createAction(
  id: string,
  description: string,
  definitionUri: string,
  hasConditions = false
): PlanDefinitionAction {
  const cpgAction: PlanDefinitionAction = {
    id: id,
    title: `Action: ${id}`,
    description: description,
    definitionUri: definitionUri
  };
  if (hasConditions) cpgAction.condition = [];
  return cpgAction;
}

function createStrategyDefinition(pathway: Pathway, libraryId: string): PlanDefinition {
  const planId = shortid.generate();

  const strategyDefinition: PlanDefinition = {
    id: planId,
    resourceType: 'PlanDefinition',
    meta: {
      profile: ['http://hl7.org/fhir/uv/cpg/StructureDefinition/cpg-strategydefinition']
    },
    extension: [
      {
        url:
          'http://build.fhir.org/ig/HL7/cqf-recommendations/StructureDefinition/cpg-knowledgeCapability.html',
        valueCode: 'executable'
      }
    ],
    url: `urn:uuid:PlanDefinition/${planId}`,
    version: '1.0',
    name: pathway.id,
    title: pathway.name,
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/plan-definition-type',
          code: 'workflow-definition',
          display: 'workflow-definition'
        }
      ]
    },
    status: PLANDEFINITION_DRAFT,
    experimental: true,
    publisher: 'Logged in user',
    description: pathway.description ?? `Pathway: ${pathway.name}`,
    library: [`urn:uuid:Library/${libraryId}`],
    action: []
  };

  return strategyDefinition;
}

function createRecommendationDefinition(node: ActionNode): PlanDefinition {
  const planId = shortid.generate();

  const recommendationDefinition: PlanDefinition = {
    id: planId,
    resourceType: 'PlanDefinition',
    meta: {
      profile: ['http://hl7.org/fhir/uv/cpg/StructureDefinition/cpg-recommendationdefinition']
    },
    extension: [
      {
        url: 'http://hl7.org/fhir/uv/cpg/StructureDefinition/cpg-knowledgeCapability',
        valueCode: 'executable'
      }
    ],
    url: `urn:uuid:PlanDefinition/${planId}`,
    version: '1.0',
    name: planId,
    title: node.label,
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/plan-definition-type',
          code: 'workflow-definition',
          display: 'workflow-definition'
        }
      ]
    },
    status: PLANDEFINITION_DRAFT,
    experimental: true,
    publisher: 'Logged in user',
    description: `Represents an action for ${node.label}`,
    action: []
  };

  return recommendationDefinition;
}

function createBundleEntry(resource: PlanDefinition | ActivityDefinition | Library): BundleEntry {
  return {
    fullUrl: `urn:uuid:${resource.resourceType}/${resource.id}`,
    resource: resource,
    request: {
      method: BUNDLE_POST,
      url: `/${resource.resourceType}`
    }
  };
}

function createLibrary(pathway: Pathway): Library {
  const libraryId = shortid.generate();

  const library: Library = {
    id: libraryId,
    resourceType: 'Library',
    meta: {
      profile: ['http://hl7.org/fhir/uv/cpg/StructureDefinition/cpg-executablelibrary']
    },
    extension: [
      {
        url: 'http://hl7.org/fhir/uv/cpg/StructureDefinition/cpg-knowledgeCapability',
        valueCode: 'executable'
      }
    ],
    url: `urn:uuid:Library/${libraryId}`,
    version: '1.0',
    name: libraryId,
    title: `Library for ${pathway.name}`,
    status: LIBRARY_DRAFT,
    experimental: true,
    type: {
      coding: [
        {
          system: '',
          code: '',
          display: ''
        }
      ]
    },
    publisher: 'Logged in user',
    description: `ELM library for pathway: ${pathway.name}`,
    content: []
  };

  if (pathway.elm) {
    library.content.push(
      {
        id: 'navigational',
        contentType: '',
        data: btoa(JSON.stringify(pathway.elm.navigational)),
        title: 'ELM for navigating the pathway'
      },
      {
        id: 'precondition',
        contentType: '',
        data: btoa(JSON.stringify(pathway.elm.preconditions)),
        title: 'ELM for pathway preconditions'
      }
    );
  }

  return library;
}

export function toCPG(pathway: Pathway): Bundle {
  const bundle: Bundle = {
    id: pathway.id,
    resourceType: 'Bundle',
    type: BUNDLE_TRANSACTION,
    entry: []
  };
  const library = createLibrary(pathway);
  const cpgStrategy = createStrategyDefinition(pathway, library.id);

  Object.keys(pathway.nodes).forEach(key => {
    const node = pathway.nodes[key];
    if (isActionNode(node) && node.key) {
      const cpgRecommendation = createRecommendationDefinition(node);
      const cpgStrategyAction = createAction(node.key, node.label, cpgRecommendation.url, true);
      const parents = findParents(pathway, node.key).map(key => pathway.nodes[key]);
      parents.forEach(parent => {
        const transition = parent.transitions.find(
          transition => transition.transition === node.key
        );
        if (isBranchNode(parent) && transition?.condition) {
          const condition = {
            kind: CONDITION_APPLICABILITY,
            expression: {
              language: EXPRESSION_CQL,
              expression: transition.condition.cql
            }
          };
          cpgStrategyAction.condition?.push(condition);
        }
      });
      node.action.forEach(action => {
        const cpgActivityDefinition = createActivityDefinition(action);
        const cpgRecommendationAction = createAction(
          action.id ?? shortid.generate(),
          action.description,
          cpgActivityDefinition.url
        );
        cpgRecommendation.action.push(cpgRecommendationAction);
        bundle.entry.push(createBundleEntry(cpgActivityDefinition));
      });
      cpgStrategy.action.push(cpgStrategyAction);
      bundle.entry.push(createBundleEntry(cpgRecommendation));
    }
  });
  bundle.entry.push(createBundleEntry(library));
  bundle.entry.push(createBundleEntry(cpgStrategy));

  return bundle;
}
