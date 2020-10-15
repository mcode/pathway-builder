import { Action, NodeObj, Pathway, PathwayNode } from 'pathways-model';
import {
  ActivityDefinition,
  Bundle,
  BundleEntry,
  Coding,
  Library,
  PlanDefinition,
  PlanDefinitionAction,
  PlanDefinitionCondition
} from 'fhir-objects';
import { Criteria } from 'criteria-model';
import { v4 as uuidv4 } from 'uuid';
import {
  isActionNode,
  isBranchNode,
  isReferenceNode,
  getTransition,
  findSubPathway,
  findParent,
  findAllTransitions,
  deepCopyPathway,
  findAllChildActionNodes,
  getCodeableConceptFromAction
} from './nodeUtils';
import { R4 } from '@ahryman40k/ts-fhir-types';
import { PlanDefinition_RelatedActionRelationshipKind } from '@ahryman40k/ts-fhir-types/lib/R4/Resource/RTTI_PlanDefinition_RelatedAction'; // eslint-disable-line
import { constructCqlLibrary, IncludedCqlLibraries } from './export';

const LIBRARY_DRAFT = R4.LibraryStatusKind._draft;
const PLANDEFINITION_DRAFT = R4.PlanDefinitionStatusKind._draft;
const ACTIVITYDEFINITION_DRAFT = R4.ActivityDefinitionStatusKind._draft;
const BUNDLE_TRANSACTION = R4.BundleTypeKind._transaction;
const BUNDLE_PUT = R4.Bundle_RequestMethodKind._put;
const CONDITION_APPLICABILITY = R4.PlanDefinition_ConditionKindKind._applicability; // eslint-disable-line
const EXPRESSION_CQL = R4.ExpressionLanguageKind._textCql;
const CHILD_RELATIONSHIP = PlanDefinition_RelatedActionRelationshipKind._beforeStart; // eslint-disable-line
const PARENT_RELATIONSHIP = PlanDefinition_RelatedActionRelationshipKind._afterEnd; // eslint-disable-line

interface ActivityDefinitionMap {
  // Code System or FakeCarePlanSystem
  [key: string]: {
    // Code or CarePlan title
    [key: string]: string; // Resource ID
  };
}

export class CPGExporter {
  pathway: Pathway;
  pathways: Pathway[];
  bundle: Bundle;
  criteria: Criteria[];
  nestedBranch: string[];
  libraries: string[];
  activityDefinitions: ActivityDefinitionMap;

  // TODO: figure out if elm works correctly here
  constructor(pathway: Pathway, pathways: Pathway[], criteria: Criteria[]) {
    // Ensure each node only has one parent
    const pathwayCopy = deepCopyPathway(pathway);
    pathwayCopy.nodes = cleanPathway(pathwayCopy.nodes);
    this.pathway = pathwayCopy;
    this.bundle = {
      id: this.pathway.id,
      resourceType: 'Bundle',
      type: BUNDLE_TRANSACTION,
      entry: []
    };
    this.criteria = criteria;
    this.nestedBranch = [];
    this.activityDefinitions = {};
    this.libraries = [];
    this.pathways = pathways;
  }

  export(): Bundle {
    const strategyDefinition = this.createPlanDefinition(
      uuidv4(),
      `Strategy${this.pathway.name}`,
      `Strategy for ${this.pathway.name}`,
      'strategy'
    );

    this._export(strategyDefinition, this.pathway);
    this.bundle.entry.push(createBundleEntry(strategyDefinition));
    return this.bundle;
  }

  _export(
    strategyDefinition: PlanDefinition,
    pathway: Pathway,
    referencedFrom?: PlanDefinitionAction,
    condition?: PlanDefinitionCondition[]
  ): void {
    // the action for the strategy definition
    const pathwayAction = createAction(pathway.name, `Action for ${pathway.name}`);
    if (referencedFrom?.id && pathwayAction.id) {
      addRelatedAction(pathwayAction, referencedFrom.id, PARENT_RELATIONSHIP);
      addRelatedAction(referencedFrom, pathwayAction.id, CHILD_RELATIONSHIP);
      if (condition) {
        pathwayAction.condition = condition;
      }
    }

    const isInDefinition = strategyDefinition.action.find(action => {
      return action.id === pathway.name;
    });

    if (!isInDefinition) {
      const libraries = this.createLibraries(pathway);
      const library = libraries[0];
      const id = uuidv4();
      const cpgRecommendation = this.createPlanDefinition(
        id,
        pathway.name,
        pathway.description,
        'recommendation',
        library.id
      );
      /*
      Use (modified) BFS to search the Pathway

      Note: BFS is used as the basis here because it could be easily modified to ensure
        the parent node is always visited before its children. This assumption is required
        for the PlanDefinition.action creation algorithm to work correctly.
    */
      const queue = ['Start'];
      const visited: string[] = [];
      while (queue.length !== 0) {
        // Key is always defined since queue.length > 0
      const key = queue.shift()!; // eslint-disable-line
        const node = pathway.nodes[key];
        const parentKey = findParent(pathway.nodes, key);

        /*
        Check parent has been visited - if not:
          Remove parent from queue if in it
          Add parent to start of the queue
          Reinsert key to the end of the list
          Break (do not convert current node)
      */
        if (parentKey && !visited.includes(parentKey)) {
          queue.filter(n => n !== parentKey);
          queue.unshift(parentKey);
          queue.push(key);
          continue;
        }

        // Visit this node and convert it
        if (parentKey)
          this.convertNode(
            key,
            parentKey,
            cpgRecommendation,
            strategyDefinition,
            pathway,
            pathwayAction,
            libraries
          );
        visited.push(key);

        // Add all unvisited and unqueued node transitions to the queue
        node.transitions.forEach(transition => {
          if (!visited.includes(transition.transition) && !queue.includes(transition.transition)) {
            queue.push(transition.transition);
          }
        });
      }
      if (cpgRecommendation.action.length) {
        pathwayAction.definitionCanonical = formatUrl('PlanDefinition', id);
        this.bundle.entry.push(createBundleEntry(cpgRecommendation));
      }
      strategyDefinition.action.push(pathwayAction);
      libraries.forEach(l => {
        const data = l.content[0].data;
        const libraryExists = this.libraries.find(entry => {
          return entry === data;
        });
        if (!libraryExists && data) {
          this.bundle.entry.push(createBundleEntry(l));
          this.libraries.push(data);
        }
      });
    }
  }

  createActivityDefinition(action: Action): ActivityDefinition | null {
    const activityId = uuidv4();
    const kind = action.resource.resourceType;

    const codeableConcept = getCodeableConceptFromAction(action);
    const coding = codeableConcept.coding[0];

    // Do not create a new resource if it already exists
    if (
      this.activityDefinitions[coding.system] &&
      this.activityDefinitions[coding.system][coding.code]
    )
      return null;

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
      kind: kind
    };

    switch (kind) {
      case 'MedicationRequest':
        activityDefinition.productCodeableConcept = codeableConcept;
        break;
      case 'ServiceRequest':
      case 'CarePlan':
        activityDefinition.code = codeableConcept;
        break;
      default:
        // do nothing
        break;
    }

    this.setActivityDefinitionId(coding, activityId);

    return activityDefinition;
  }

  createPlanDefinition(
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

    if (libraryId) planDefinition.library = [libraryId];

    return planDefinition;
  }

  createLibraries(pathway: Pathway): Library[] {
    const libraryId = uuidv4();
    const libraryName = `LIB${libraryId.substring(0, 7)}`;

    const mainLibrary: Library = {
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

    const includedCqlLibraries: IncludedCqlLibraries = {};
    const referencedDefines: Record<string, string> = {};

    const builderDefines: Record<string, string> = {};

    // iterate through the nodes and find all criteria that are actually used.
    // for each one, add the criteria CQL to our appropriate map
    //  - if it's an included library, keep track of the library name and version
    //    as well as the specific definition we're referencing
    //  - if it was constructed in the builder, track the name and raw CQL
    for (const nodeId in pathway.nodes) {
      const node = pathway.nodes[nodeId];
      for (const transition of node.transitions) {
        if (transition.condition?.criteriaSource) {
          const criteriaSource = this.criteria.find(
            c => c.id === transition.condition?.criteriaSource
          );
          if (criteriaSource?.elm && criteriaSource?.cql) {
            const libraryIdentifier = criteriaSource.elm.library.identifier;
            includedCqlLibraries[libraryIdentifier.id] = {
              cql: criteriaSource.cql,
              version: libraryIdentifier.version
            };

            referencedDefines[transition.condition.cql] = libraryIdentifier.id;
          } else if (criteriaSource?.builder) {
            builderDefines[criteriaSource.statement] = criteriaSource.builder.cql;
          }
        }
      }
    }

    const additionalLibraries: Library[] = Object.entries(includedCqlLibraries).map(
      ([name, details]) => {
        const newId = uuidv4();
        return {
          id: newId,
          resourceType: 'Library',
          url: `urn:uuid:${newId}`,
          version: details.version,
          name: name,
          title: name,
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
          description: `CQL/ELM library for pathway: ${pathway.name} / sublibrary ${name}`,
          content: [
            {
              id: name,
              contentType: 'text/cql',
              data: btoa(details.cql),
              title: `CQL for library ${name}`
            }
          ]
        };
      }
    );

    const libraryCql = constructCqlLibrary(
      libraryName,
      includedCqlLibraries,
      referencedDefines,
      builderDefines
    );

    mainLibrary.content.push({
      id: 'navigational-cql',
      contentType: 'text/cql',
      data: btoa(libraryCql),
      title: 'CQL for navigating the pathway'
    });

    if (pathway.elm) {
      mainLibrary.content.push(
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

    return [mainLibrary, ...additionalLibraries];
  }

  private convertNode(
    key: string,
    parentKey: string,
    cpgRecommendation: PlanDefinition,
    strategyDefinition: PlanDefinition,
    pathway: Pathway,
    pathwayAction: PlanDefinitionAction,
    libraries: Library[]
  ): void {
    const node = pathway.nodes[key];
    const parent = pathway.nodes[parentKey];
    const descriptionDetails = `${node.label} (Key: ${key}) - Parent Node Key: ${parentKey}`;

    if (isActionNode(node)) {
      const activityDefinition = this.createActivityDefinition(node.action);
      const description = `Action for ${descriptionDetails}`;
      const activityDefinitionId = activityDefinition
        ? activityDefinition.id
        : this.getActivityDefinitionId(node.action);
      const cpgAction = createAction(key, description, activityDefinitionId);

      if (isBranchNode(parent)) cpgAction.condition = this.createCondition(parent, key, libraries);

      // Traverse up to find closest action and add as related action
      let parentAction = parent;
      while (isBranchNode(parentAction)) {
        const tempParentKey = findParent(pathway.nodes, parentAction.key);
        if (tempParentKey) parentAction = pathway.nodes[tempParentKey];
        else break;
      }
      if (parentAction.key !== 'Start')
        addRelatedAction(cpgAction, parentAction.key, PARENT_RELATIONSHIP);

      // Add a related action for each action child
      const childActionNodeKeys = findAllChildActionNodes(pathway.nodes, key);
      childActionNodeKeys.forEach(childKey =>
        addRelatedAction(cpgAction, childKey, CHILD_RELATIONSHIP)
      );

      this.addActionToPlanDefinition(cpgAction, cpgRecommendation, parent.key);

      if (activityDefinition) this.bundle.entry.push(createBundleEntry(activityDefinition));
    } else if (isBranchNode(node)) {
      const description = `Branch based on ${descriptionDetails}`;

      // Add an action for the branch node if it nested
      if (isBranchNode(parent)) {
        const cpgAction = createAction(key, description);
        cpgAction.condition = this.createCondition(parent, key, libraries);
        this.nestedBranch.push(key);
        this.addActionToPlanDefinition(cpgAction, cpgRecommendation, parent.key);
      }
    } else if (isReferenceNode(node)) {
      const referencedPathway = this.pathways.find((pathway: Pathway) => {
        return pathway.id === node.referenceId;
      });
      if (referencedPathway) {
        const pathwayCopy = deepCopyPathway(referencedPathway);
        pathwayCopy.nodes = cleanPathway(pathwayCopy.nodes);
        if (isBranchNode(parent)) {
          const condition = this.createCondition(parent, key, libraries);
          this._export(strategyDefinition, pathwayCopy, pathwayAction, condition);
        } else {
          this._export(strategyDefinition, pathwayCopy, pathwayAction);
        }
      }
    } else if (node.type !== 'start') {
      const msg = `Error Exporting at Node ${node.label}\n${node.label} Node does not have a node type. Please edit the node to have a node type and add applicable details and try again.`; // eslint-disable-line
      alert(msg);
      console.error(`${msg}\n${JSON.stringify(node, undefined, 2)}`);
      throw msg; // Prevent the export from continuing
    }
  }

  private createCondition(
    parent: PathwayNode,
    key: string,
    libraries: Library[]
  ): PlanDefinitionCondition[] {
    const library = libraries[0];
    const transition = getTransition(parent, key);
    if (transition) {
      const criteriaSource = this.criteria.find(c => c.id === transition.condition?.criteriaSource);
      return [
        {
          kind: CONDITION_APPLICABILITY,
          expression: {
            // TODO: this would be cleaner if it was "text/cql.name" instead of "text/cql"
            // however the typescript type doesn't allow that.
            // if we do eventually change it to cql.name,
            // change expression below to just be criteriaSource.statement
            language: EXPRESSION_CQL,
            expression: `${library.name}.${criteriaSource?.statement}`
          }
        }
      ];
    } else return [];
  }

  private getActivityDefinitionId(action: Action): string {
    const codeableConcept = getCodeableConceptFromAction(action);
    const coding = codeableConcept.coding[0];
    return this.activityDefinitions[coding.system][coding.code];
  }

  private setActivityDefinitionId(coding: Coding, id: string): void {
    if (!this.activityDefinitions[coding.system]) this.activityDefinitions[coding.system] = {};
    this.activityDefinitions[coding.system][coding.code] = id;
  }

  private addActionToPlanDefinition(
    action: PlanDefinitionAction,
    planDefinition: PlanDefinition,
    parentKey: string
  ): void {
    if (this.nestedBranch.includes(parentKey)) {
      const parentAction = findAction(planDefinition.action, parentKey);
      if (!parentAction) return;
      else if (parentAction.action?.length) parentAction.action.push(action);
      else parentAction.action = [action];
    } else planDefinition.action.push(action);
  }
}

function formatUrl(resourceType: string, id: string): string {
  return `http://example.com/${resourceType}/${id}`;
}

function addRelatedAction(
  cpgAction: PlanDefinitionAction,
  relatedId: string,
  relationship: PlanDefinition_RelatedActionRelationshipKind // eslint-disable-line
): void {
  const relatedAction = {
    actionId: relatedId,
    relationship: relationship
  };
  if (cpgAction.relatedAction?.length) cpgAction.relatedAction.push(relatedAction);
  else cpgAction.relatedAction = [relatedAction];
}

function findAction(actions: PlanDefinitionAction[], id: string): PlanDefinitionAction | undefined {
  for (const action of actions) {
    if (action.id === id) return action;
    else if (action.action) {
      const foundAction = findAction(action.action, id);
      if (foundAction) return foundAction;
    }
  }
  return;
}

function createBundleEntry(resource: PlanDefinition | ActivityDefinition | Library): BundleEntry {
  return {
    fullUrl: formatUrl(resource.resourceType, resource.id),
    resource: resource,
    request: {
      method: BUNDLE_PUT,
      url: `/${resource.resourceType}/${resource.id}`
    }
  };
}

function createAction(id: string, description: string, definition?: string): PlanDefinitionAction {
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
    ]
  };
  if (definition) cpgAction.definitionCanonical = formatUrl('ActivityDefinition', definition);
  return cpgAction;
}

export function cleanPathway(nodes: NodeObj): NodeObj {
  const newNodes = nodes;
  Object.keys(nodes).forEach(key => {
    const allTransitions = findAllTransitions(nodes, key);

    // Remove multiple transitions to node by copying subpathway
    if (allTransitions.length > 1) {
      allTransitions.shift(); // Remove one transition to maintain the original subpathway
      allTransitions.forEach(transition => {
        // Get the sub pathway rooted at current node
        let subPathway = findSubPathway(nodes, key);
        subPathway = cleanPathway(subPathway);

        // Replace the transition with the copy
        if (transition) {
          transition.transition = subPathway[Object.keys(subPathway)[0]].key;
          Object.keys(subPathway).forEach(nodeKey => (newNodes[nodeKey] = subPathway[nodeKey]));
        }
      });
    }
  });

  return newNodes;
}
