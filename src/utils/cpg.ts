import { Action, Pathway } from 'pathways-model';
import {
  ActivityDefinition,
  PlanDefinition,
  PlanDefinitionAction,
  Bundle,
  BundleEntry,
  Library
} from 'fhir-objects';
import { Criteria } from 'criteria-model';
import { v4 as uuidv4 } from 'uuid';
import { isActionNode, findParents, isBranchNode } from './nodeUtils';
import { R4 } from '@ahryman40k/ts-fhir-types';

const LIBRARY_DRAFT = R4.LibraryStatusKind._draft;
const PLANDEFINITION_DRAFT = R4.PlanDefinitionStatusKind._draft;
const ACTIVITYDEFINITION_DRAFT = R4.ActivityDefinitionStatusKind._draft;
const BUNDLE_TRANSACTION = R4.BundleTypeKind._transaction;
const BUNDLE_PUT = R4.Bundle_RequestMethodKind._put;
const CONDITION_APPLICABILITY = R4.PlanDefinition_ConditionKindKind._applicability; // eslint-disable-line

// TODO: this one needs to be `text/cql.name` to make cqf-ruler work
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

function createLibrary(pathway: Pathway, criteria: Criteria[]): Library[] {
  const libraryId = uuidv4();
  const libraryName = `LIB${libraryId.substring(0, 7)}`;

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
    name: libraryName,
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
    description: `CQL/ELM library for pathway: ${pathway.name}`,
    content: []
  };

  const includedCqlLibraries: { [k: string]: string } = {}; // TODO: need version
  const referencedDefines: { [k: string]: string } = {};

  const builderDefines: { [k: string]: string } = {};

  for (const nodeId in pathway.nodes) {
    const node = pathway.nodes[nodeId];
    for (const transition of node.transitions) {
      if (transition.condition?.criteriaSource) {
        const criteriaSource = criteria.find(c => c.id === transition.condition?.criteriaSource);
        if (criteriaSource && criteriaSource.elm && criteriaSource.cql) {
          const libraryId = criteriaSource.elm.library.identifier.id;
          includedCqlLibraries[libraryId] = criteriaSource.cql;

          referencedDefines[transition.condition.cql] = libraryId;
        } else if (criteriaSource && criteriaSource.builder) {
          builderDefines[criteriaSource.statement] = criteriaSource.builder.cql;
        }
      }
    }
  }

  const additionalLibraries: Library[] = Object.entries(includedCqlLibraries).map(([k, v]) => {
    const newId = uuidv4();
    return {
      id: newId,
      resourceType: 'Library',
      url: `urn:uuid:${newId}`,
      version: '1.0', // TODO
      name: k,
      title: k,
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
      description: `CQL/ELM library for pathway: ${pathway.name} / sublibrary ${k}`,
      content: [
        {
          id: k,
          contentType: 'text/cql',
          data: btoa(v),
          title: `CQL for library ${k}`
        }
      ]
    };
  });

  const includes = Object.entries(includedCqlLibraries)
    .map(([k, v]) => `include "${k}" version '1.0' called ${k}\n\n`)
    .join('');
  const definesList = Object.entries(referencedDefines).map(
    ([k, v]) => `define "${k}": ${v}.${k}\n\n`
  );

  Object.entries(builderDefines).forEach(([k, v]) => definesList.push(`define "${k}": ${v}\n\n`));

  const defines = definesList.join('');

  const libraryCql = `
library ${libraryName} version '1.0'

using FHIR version '4.0.0'

${includes}

context Patient

${defines}
`;

  library.content.push({
    id: 'navigational-cql',
    contentType: 'text/cql',
    data: btoa(libraryCql),
    title: 'CQL for navigating the pathway'
  });

  if (pathway.elm) {
    library.content.push(
      {
        id: 'navigational-elm',
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

  return [library, ...additionalLibraries];
}

export function toCPG(pathway: Pathway, criteria: Criteria[]): Bundle {
  const bundle: Bundle = {
    id: pathway.id,
    resourceType: 'Bundle',
    type: BUNDLE_TRANSACTION,
    entry: []
  };
  const libraries = createLibrary(pathway, criteria);
  const library = libraries[0];
  const cpgStrategy = createPlanDefinition(
    uuidv4(),
    pathway.name,
    pathway.description,
    'strategy',
    library.id
  );

  Object.keys(pathway.nodes).forEach(key => {
    const node = pathway.nodes[key];
    if (isActionNode(node) && node.key && node.action) {
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
          const criteriaSource = criteria.find(c => c.id === transition?.condition?.criteriaSource);
          const condition = {
            kind: CONDITION_APPLICABILITY,
            expression: {
              language: EXPRESSION_CQL,
              expression: criteriaSource?.statement // should never be null
            }
          };
          cpgStrategyAction.condition = cpgStrategyAction.condition || [];
          cpgStrategyAction.condition?.push(condition);
        }
      });
      const action = node.action;
      const cpgActivityDefinition = createActivityDefinition(action);
      const cpgRecommendationAction = createAction(
        action.id,
        action.description,
        cpgActivityDefinition.id
      );
      cpgRecommendation.action.push(cpgRecommendationAction);
      bundle.entry.push(createBundleEntry(cpgActivityDefinition));
      cpgStrategy.action.push(cpgStrategyAction);
      bundle.entry.push(createBundleEntry(cpgRecommendation));
    }
  });
  libraries.forEach(l => bundle.entry.push(createBundleEntry(l)));
  bundle.entry.push(createBundleEntry(cpgStrategy));

  return bundle;
}
