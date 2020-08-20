import { Action, Pathway } from 'pathways-model';
import {
  ActivityDefinition,
  PlanDefinition,
  PlanDefinitionAction,
  Bundle,
  BundleEntry,
  Library
} from 'fhir-objects';
import { v4 as uuidv4 } from 'uuid';
import { isActionNode, findParents, isBranchNode } from './nodeUtils';
import { R4 } from '@ahryman40k/ts-fhir-types';

const LIBRARY_DRAFT = R4.LibraryStatusKind._draft;
const PLANDEFINITION_DRAFT = R4.PlanDefinitionStatusKind._draft;
const ACTIVITYDEFINITION_DRAFT = R4.ActivityDefinitionStatusKind._draft;
const BUNDLE_TRANSACTION = R4.BundleTypeKind._transaction;
const BUNDLE_PUT = R4.Bundle_RequestMethodKind._put;
const CONDITION_APPLICABILITY = R4.PlanDefinition_ConditionKindKind._applicability; // eslint-disable-line
const EXPRESSION_CQL = R4.ExpressionLanguageKind._textCql;

export function createActivityDefinition(action: Action): ActivityDefinition {
  const activityId = uuidv4();
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
        url: 'http://hl7.org/fhir/uv/cpg/StructureDefinition/cpg-knowledgeCapability',
        valueCode: 'publishable'
      }
    ],
    url: `urn:uuid:${activityId}`,
    version: '1.0',
    name: `AD${activityId.substring(0, 7)}`,
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

function createAction(id: string, description: string, definition: string): PlanDefinitionAction {
  const cpgAction: PlanDefinitionAction = {
    id: id,
    title: `Action: ${id}`,
    description: description,
    code: [
      {
        coding: [
          {
            system: 'http://hl7.org/fhir/uv/cpg/CodeSystem/cpg-common-process',
            code: 'guideline-based-care',
            display: 'Guideline-based Care'
          }
        ]
      }
    ],
    definitionCanonical: `http://pathway.com/${definition}`
  };
  return cpgAction;
}

export function createPlanDefinition(
  id: string,
  title: string,
  description: string,
  type: 'strategy' | 'recommendation',
  libraryId?: string
): PlanDefinition {
  const planDefinition: PlanDefinition = {
    id: id,
    resourceType: 'PlanDefinition',
    meta: {
      profile: [`http://hl7.org/fhir/uv/cpg/StructureDefinition/cpg-${type}definition`]
    },
    extension: [
      {
        url: 'http://hl7.org/fhir/uv/cpg/StructureDefinition/cpg-knowledgeCapability',
        valueCode: 'executable'
      }
    ],
    url: `urn:uuid:${id}`,
    version: '1.0',
    name: `PD${id.substring(0, 7)}`,
    title: title,
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/plan-definition-type',
          code: type === 'strategy' ? 'workflow-definition' : 'eca-rule',
          display: type === 'strategy' ? 'Workflow Definition' : 'ECA Rule'
        }
      ]
    },
    status: PLANDEFINITION_DRAFT,
    experimental: true,
    publisher: 'Logged in user',
    description: description,
    action: []
  };

  if (type === 'strategy' && libraryId) {
    planDefinition.library = [libraryId];
  }

  return planDefinition;
}

function createBundleEntry(resource: PlanDefinition | ActivityDefinition | Library): BundleEntry {
  return {
    fullUrl: `http://pathway.com/${resource.id}`,
    resource: resource,
    request: {
      method: BUNDLE_PUT,
      url: `/${resource.resourceType}/${resource.id}`
    }
  };
}

function createLibrary(pathway: Pathway): Library {
  const libraryId = uuidv4();

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
    url: `urn:uuid:${libraryId}`,
    version: '1.0',
    name: `LIB${libraryId.substring(0, 7)}`,
    title: `Library for ${pathway.name}`,
    status: LIBRARY_DRAFT,
    experimental: true,
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/library-type',
          code: 'logic-library',
          display: 'Logic Library'
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
        contentType: 'application/elm+json',
        data: btoa(JSON.stringify(pathway.elm.navigational)),
        title: 'ELM for navigating the pathway'
      },
      {
        id: 'precondition',
        contentType: 'application/elm+json',
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
  const cpgStrategy = createPlanDefinition(
    uuidv4(),
    pathway.name,
    pathway.description ?? `Pathway For: ${pathway.name}`,
    'strategy',
    library.id
  );

  Object.keys(pathway.nodes).forEach(key => {
    const node = pathway.nodes[key];
    if (isActionNode(node) && node.key) {
      const description = `Represents an action for ${node.label}`;
      const cpgRecommendation = createPlanDefinition(
        uuidv4(),
        node.label,
        description,
        'recommendation'
      );
      const cpgStrategyAction = createAction(node.key, node.label, cpgRecommendation.id);
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
          cpgStrategyAction.condition = cpgStrategyAction.condition || [];
          cpgStrategyAction.condition?.push(condition);
        }
      });
      node.action.forEach(action => {
        const cpgActivityDefinition = createActivityDefinition(action);
        const cpgRecommendationAction = createAction(
          action.id ?? uuidv4(),
          action.description,
          cpgActivityDefinition.id
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
