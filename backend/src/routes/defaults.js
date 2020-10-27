export const criteria = [
  {
    id: '12',
    label: 'Criteria',
    version: '1.0.0',
    modified: 1000,
    statement: 'T0',
    cql: 'Cql',
  },
];

export const pathways = [
  {
    id: 'tB4jsxTDL',
    name: 'Early Stage HER2+ (Draft)',
    description:
      'Pathway for the Early Stage HER2+ Initial Medical Consult Breast Cancer Pathway. This is a draft pathway.',
    library: ['mCODE_Library.cql'],
    preconditions: [
      {
        id: '1',
        elementName: 'Condition',
        expected: 'Breast Cancer',
        cql:
          '"Primary Cancer Condition" PrimaryCancer return Tuple{ value: PrimaryCancer.code.text.value, match: PrimaryCancer.code.text.value ~ \'Malignant neoplasm of breast (disorder)\' } ',
      },
      {
        id: '2',
        elementName: 'HER2 Status',
        expected: 'Positive',
        cql:
          '[Observation: "HER2 [Presence] in Breast cancer specimen by Immune stain"] Her2 return Tuple{ value: Her2.value.text.value, match: Her2.value.text.value ~ \'Positive\' } ',
      },
    ],
    nodes: {
      Start: {
        key: 'Start',
        label: 'Start',
        type: 'start',
        transitions: [
          {
            id: '1',
            transition: 'NodeStatus',
          },
        ],
      },
      NodeStatus: {
        key: 'NodeStatus',
        label: 'Node Status',
        type: 'branch',
        transitions: [
          {
            id: '1',
            transition: 'TumorSize',
            condition: {
              description: 'N0',
              cql:
                '[Observation: "Regional lymph nodes.clinical [Class] Cancer code"] N0 where ToConcept(N0.value as FHIR.CodeableConcept) ~ "N0 category (finding)" return Tuple{ resourceType: \'Observation\', id: N0.id.value , status: N0.status.value} ',
            },
          },
          {
            id: '2',
            transition: 'ChemotherapyTCHAC+TH',
            condition: {
              description: 'N+',
              cql:
                ' [Observation: "Regional lymph nodes.clinical [Class] Cancer code"] NLarge let NLargeConcept: ToConcept(NLarge.value as FHIR.CodeableConcept) where NLargeConcept ~ "N1 category (finding)" or NLargeConcept ~ "N2 category (finding)" or NLargeConcept ~ "N3 category (finding)" return Tuple{ resourceType: \'Observation\', id: NLarge.id.value , status: NLarge.status.value} ',
            },
          },
        ],
      },
      TumorSize: {
        key: 'TumorSize',
        label: 'Tumor Size',
        type: 'branch',
        transitions: [
          {
            id: '1',
            transition: 'ChemotherapyTCHAC+TH',
            condition: {
              description: 'T > 2cm',
              cql:
                '[Observation: "Primary tumor.clinical [Class] Cancer code"] TLarge let TLageConcept: ToConcept(TLarge.value as FHIR.CodeableConcept) where TLageConcept ~ "T2 category (finding)" or TLageConcept ~ "T3 category (finding)" or TLageConcept ~ "T4 category (finding)" return Tuple{ resourceType: \'Observation\', id: TLarge.id.value , status: TLarge.status.value} ',
            },
          },
          {
            id: '2',
            transition: 'ChemotherapyTHWeekly',
            condition: {
              description: 'T <= 2cm',
              cql:
                '[Observation: "Primary tumor.clinical [Class] Cancer code"] TSmall where ToConcept(TSmall.value as FHIR.CodeableConcept) ~ "T0 category (finding)" or ToConcept(TSmall.value as FHIR.CodeableConcept) ~ "T1 category (finding)" return Tuple{ resourceType: \'Observation\', id: TSmall.id.value , status: TSmall.status.value} ',
            },
          },
        ],
      },
      ChemotherapyTHWeekly: {
        key: 'ChemotherapyTHWeekly',
        label: 'Chemotherapy TH Weekly',
        type: 'action',
        action: {
          id: '1',
          type: 'create',
          description: 'Chemotherapy TH Weekly',
          resource: {
            resourceType: 'ServiceRequest',
            code: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '367336001',
                  display: 'Chemotherapy (procedure)',
                },
              ],
              text: 'Chemotherapy (procedure)',
            },
          },
        },
        transitions: [
          {
            id: '1',
            transition: 'PostchemotherapyTrastuzumabRequest',
          },
        ],
        cql:
          'if exists [Procedure: "Chemotherapy (procedure) code"] then [Procedure: "Chemotherapy (procedure) code"] Chemo return Tuple{ resourceType: \'Procedure\', id: Chemo.id.value , status: Chemo.status.value} else [ServiceRequest: "Chemotherapy (procedure) code"] Request return Tuple{ resourceType: \'ServiceRequest\', id: Request.id.value, status: Request.status.value }',
      },
      'ChemotherapyTCHAC+TH': {
        key: 'ChemotherapyTCHAC+TH',
        label: 'Chemotherapy TCH AC + TH',
        type: 'action',
        action: {
          id: '1',
          type: 'create',
          description: 'Chemotherapy TCH AC + TH',
          resource: {
            resourceType: 'ServiceRequest',
            code: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '367336001',
                  display: 'Chemotherapy (procedure)',
                },
              ],
              text: 'Chemotherapy (procedure)',
            },
          },
        },
        transitions: [
          {
            id: '1',
            transition: 'PostchemotherapyTrastuzumabRequest',
          },
        ],
        cql:
          'if exists [Procedure: "Chemotherapy (procedure) code"] then [Procedure: "Chemotherapy (procedure) code"] Chemo return Tuple{ resourceType: \'Procedure\', id: Chemo.id.value , status: Chemo.status.value} else [ServiceRequest: "Chemotherapy (procedure) code"] Request return Tuple{ resourceType: \'ServiceRequest\', id: Request.id.value, status: Request.status.value }',
      },
      PostchemotherapyTrastuzumabRequest: {
        key: 'PostchemotherapyTrastuzumabRequest',
        label: 'Post-Chemotherapy Trastuzumab Request',
        type: 'action',
        action: {
          id: '1',
          type: 'create',
          description: 'Post Chemotherapy Trastuzumab (1 year total duration recommended)',
          resource: {
            resourceType: 'MedicationRequest',
            medicationCodeableConcept: {
              coding: [
                {
                  system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                  code: '1922509',
                  display: 'trastuzumab',
                },
              ],
              text: 'trastuzumab',
            },
          },
        },
        transitions: [
          {
            id: '1',
            transition: 'ERStatus',
          },
        ],
        cql:
          '[MedicationRequest: "trastuzumab 150 MG Injection code"] PCT return Tuple{ resourceType: \'MedicationRequest\', id: PCT.id.value , status: PCT.status.value} ',
      },
      ERStatus: {
        key: 'ERStatus',
        label: 'ER Status',
        type: 'branch',
        transitions: [
          {
            id: '1',
            transition: 'EndocrineTherapy',
            condition: {
              description: 'ERPositive',
              cql:
                '[Observation: "Estrogen receptor Ag [Presence] in Breast cancer specimen by Immune stain code"] Pos where ToConcept(Pos.value as FHIR.CodeableConcept) ~ "Positive (qualifier value)" return Tuple{ resourceType: \'Observation\', id: Pos.id.value , status: Pos.status.value} ',
            },
          },
        ],
      },
      EndocrineTherapy: {
        key: 'EndocrineTherapy',
        label: 'Endocrine Therapy',
        type: 'action',
        action: {
          id: '1',
          type: 'create',
          description: 'Hormone Therapy',
          resource: {
            resourceType: 'ServiceRequest',
            code: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '169413002',
                  display: 'Hormone therapy (procedure)',
                },
              ],
              text: 'Hormone therapy (procedure)',
            },
          },
        },
        transitions: [],
      },
    },
    elm: {
      navigational: {
        library: {
          identifier: {
            id: 'mCODEResources',
            version: '1',
          },
          schemaIdentifier: {
            id: 'urn:hl7-org:elm',
            version: 'r1',
          },
          usings: {
            def: [
              {
                localIdentifier: 'System',
                uri: 'urn:hl7-org:elm-types:r1',
              },
              {
                localIdentifier: 'FHIR',
                uri: 'http://hl7.org/fhir',
                version: '4.0.0',
              },
            ],
          },
          codeSystems: {
            def: [
              {
                name: 'SNOMEDCT',
                id: 'http://snomed.info/sct',
                accessLevel: 'Public',
              },
              {
                name: 'LOINC',
                id: 'http://loinc.org',
                accessLevel: 'Public',
              },
              {
                name: 'RXNORM',
                id: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                accessLevel: 'Public',
              },
            ],
          },
          codes: {
            def: [
              {
                name: 'Primary tumor.clinical [Class] Cancer code',
                id: '21905-5',
                display: 'Primary tumor.clinical [Class] Cancer',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'LOINC',
                },
              },
              {
                name: 'Regional lymph nodes.clinical [Class] Cancer code',
                id: '21906-3',
                display: 'Regional lymph nodes.clinical [Class] Cancer',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'LOINC',
                },
              },
              {
                name: 'HER2 [Presence] in Breast cancer specimen by Immune stain code',
                id: '85319-2',
                display: 'HER2 [Presence] in Breast cancer specimen by Immune stain',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'LOINC',
                },
              },
              {
                name: 'T0 category (finding) code',
                id: '58790005',
                display: 'T0 category (finding)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'T1 category (finding) code',
                id: '23351008',
                display: 'T1 category (finding)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'N0 category (finding) code',
                id: '62455006',
                display: 'N0 category (finding)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'N1 category (finding) code',
                id: '53623008',
                display: 'N1 category (finding)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Lumpectomy of breast (procedure) code',
                id: '392021009',
                display: 'Lumpectomy of breast (procedure)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Teleradiotherapy procedure (procedure) code',
                id: '33195004',
                display: 'Teleradiotherapy procedure (procedure)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Chemotherapy (procedure) code',
                id: '367336001',
                display: 'Chemotherapy (procedure)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: '14 ML pertuzumab 30 MG/ML Injection code',
                id: '1298948',
                display: '14 ML pertuzumab 30 MG/ML Injection',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'RXNORM',
                },
              },
              {
                name: 'Cyclophosphamide 1000 MG Injection code',
                id: '1734919',
                display: 'Cyclophosphamide 1000 MG Injection',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'RXNORM',
                },
              },
              {
                name: 'trastuzumab 150 MG Injection code',
                id: '1922509',
                display: 'trastuzumab 150 MG Injection',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'RXNORM',
                },
              },
              {
                name: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection code',
                id: '1790099',
                display: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'RXNORM',
                },
              },
              {
                name: '11p partial monosomy syndrome 4135001 code',
                id: '4135001',
                display: '11p partial monosomy syndrome',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Orbital lymphoma 13048006 code',
                id: '13048006',
                display: 'Orbital lymphoma',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Delta heavy chain disease 20224008 code',
                id: '20224008',
                display: 'Delta heavy chain disease',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Malignant neoplasm of breast 254837009 code',
                id: '254837009',
                display: 'Malignant neoplasm of breast',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Primary malignant neoplasm of colon 93761005 code',
                id: '93761005',
                display: 'Primary malignant neoplasm of colon',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Secondary malignant neoplasm of colon 94260004 code',
                id: '94260004',
                display: 'Secondary malignant neoplasm of colon',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Carcinoma in situ of prostate (disorder) 92691004 code',
                id: '92691004',
                display: 'Carcinoma in situ of prostate (disorder)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Small cell carcinoma of lung (disorder) 254632001 code',
                id: '254632001',
                display: 'Small cell carcinoma of lung (disorder)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Non-small cell lung cancer (disorder) 254637007 code',
                id: '254637007',
                display: 'Non-small cell lung cancer (disorder)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
            ],
          },
          concepts: {
            def: [
              {
                name: 'T0 category (finding)',
                display: 'T0 category (finding)',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'T0 category (finding) code',
                  },
                ],
              },
              {
                name: 'T1 category (finding)',
                display: 'T1 category (finding)',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'T1 category (finding) code',
                  },
                ],
              },
              {
                name: 'N0 category (finding)',
                display: 'N0 category (finding)',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'N0 category (finding) code',
                  },
                ],
              },
              {
                name: 'N1 category (finding)',
                display: 'N1 category (finding)',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'N1 category (finding) code',
                  },
                ],
              },
              {
                name: '14 ML pertuzumab 30 MG/ML Injection',
                display: '14 ML pertuzumab 30 MG/ML Injection',
                accessLevel: 'Public',
                code: [
                  {
                    name: '14 ML pertuzumab 30 MG/ML Injection code',
                  },
                ],
              },
              {
                name: 'Cyclophosphamide 1000 MG Injection',
                display: 'Cyclophosphamide 1000 MG Injection',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'Cyclophosphamide 1000 MG Injection code',
                  },
                ],
              },
              {
                name: 'trastuzumab 150 MG Injection',
                display: 'trastuzumab 150 MG Injection',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'trastuzumab 150 MG Injection code',
                  },
                ],
              },
              {
                name: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection',
                display: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection',
                accessLevel: 'Public',
                code: [
                  {
                    name: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection code',
                  },
                ],
              },
              {
                name: 'HER2 [Presence] in Breast cancer specimen by Immune stain',
                display: 'HER2 [Presence] in Breast cancer specimen by Immune stain',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'HER2 [Presence] in Breast cancer specimen by Immune stain code',
                  },
                ],
              },
              {
                name: 'Primary cancers',
                accessLevel: 'Public',
                code: [
                  {
                    name: '11p partial monosomy syndrome 4135001 code',
                  },
                  {
                    name: 'Orbital lymphoma 13048006 code',
                  },
                  {
                    name: 'Delta heavy chain disease 20224008 code',
                  },
                  {
                    name: 'Malignant neoplasm of breast 254837009 code',
                  },
                  {
                    name: 'Primary malignant neoplasm of colon 93761005 code',
                  },
                  {
                    name: 'Secondary malignant neoplasm of colon 94260004 code',
                  },
                  {
                    name: 'Carcinoma in situ of prostate (disorder) 92691004 code',
                  },
                  {
                    name: 'Small cell carcinoma of lung (disorder) 254632001 code',
                  },
                  {
                    name: 'Non-small cell lung cancer (disorder) 254637007 code',
                  },
                ],
              },
            ],
          },
          statements: {
            def: [
              {
                name: 'Patient',
                context: 'Patient',
                expression: {
                  type: 'SingletonFrom',
                  operand: {
                    dataType: '{http://hl7.org/fhir}Patient',
                    type: 'Retrieve',
                  },
                },
              },
              {
                name: 'Primary Cancer Condition',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'Cancer',
                      expression: {
                        dataType: '{http://hl7.org/fhir}Condition',
                        codeProperty: 'code',
                        type: 'Retrieve',
                        codes: {
                          type: 'ToList',
                          operand: {
                            name: 'Primary cancers',
                            type: 'ConceptRef',
                          },
                        },
                      },
                    },
                  ],
                  relationship: [],
                },
              },
              {
                name: 'ToCode',
                context: 'Patient',
                accessLevel: 'Public',
                type: 'FunctionDef',
                expression: {
                  type: 'If',
                  condition: {
                    asType: '{urn:hl7-org:elm-types:r1}Boolean',
                    type: 'As',
                    operand: {
                      type: 'IsNull',
                      operand: {
                        name: 'coding',
                        type: 'OperandRef',
                      },
                    },
                  },
                  then: {
                    asType: '{urn:hl7-org:elm-types:r1}Code',
                    type: 'As',
                    operand: {
                      type: 'Null',
                    },
                  },
                  else: {
                    classType: '{urn:hl7-org:elm-types:r1}Code',
                    type: 'Instance',
                    element: [
                      {
                        name: 'code',
                        value: {
                          path: 'value',
                          type: 'Property',
                          source: {
                            path: 'code',
                            type: 'Property',
                            source: {
                              name: 'coding',
                              type: 'OperandRef',
                            },
                          },
                        },
                      },
                      {
                        name: 'system',
                        value: {
                          path: 'value',
                          type: 'Property',
                          source: {
                            path: 'system',
                            type: 'Property',
                            source: {
                              name: 'coding',
                              type: 'OperandRef',
                            },
                          },
                        },
                      },
                      {
                        name: 'version',
                        value: {
                          path: 'value',
                          type: 'Property',
                          source: {
                            path: 'version',
                            type: 'Property',
                            source: {
                              name: 'coding',
                              type: 'OperandRef',
                            },
                          },
                        },
                      },
                      {
                        name: 'display',
                        value: {
                          path: 'value',
                          type: 'Property',
                          source: {
                            path: 'display',
                            type: 'Property',
                            source: {
                              name: 'coding',
                              type: 'OperandRef',
                            },
                          },
                        },
                      },
                    ],
                  },
                },
                operand: [
                  {
                    name: 'coding',
                    operandTypeSpecifier: {
                      name: '{http://hl7.org/fhir}Coding',
                      type: 'NamedTypeSpecifier',
                    },
                  },
                ],
              },
              {
                name: 'ToConcept',
                context: 'Patient',
                accessLevel: 'Public',
                type: 'FunctionDef',
                expression: {
                  type: 'If',
                  condition: {
                    asType: '{urn:hl7-org:elm-types:r1}Boolean',
                    type: 'As',
                    operand: {
                      type: 'IsNull',
                      operand: {
                        name: 'concept',
                        type: 'OperandRef',
                      },
                    },
                  },
                  then: {
                    asType: '{urn:hl7-org:elm-types:r1}Concept',
                    type: 'As',
                    operand: {
                      type: 'Null',
                    },
                  },
                  else: {
                    classType: '{urn:hl7-org:elm-types:r1}Concept',
                    type: 'Instance',
                    element: [
                      {
                        name: 'codes',
                        value: {
                          type: 'Query',
                          source: [
                            {
                              alias: 'C',
                              expression: {
                                path: 'coding',
                                type: 'Property',
                                source: {
                                  name: 'concept',
                                  type: 'OperandRef',
                                },
                              },
                            },
                          ],
                          relationship: [],
                          return: {
                            expression: {
                              name: 'ToCode',
                              type: 'FunctionRef',
                              operand: [
                                {
                                  name: 'C',
                                  type: 'AliasRef',
                                },
                              ],
                            },
                          },
                        },
                      },
                      {
                        name: 'display',
                        value: {
                          path: 'value',
                          type: 'Property',
                          source: {
                            path: 'text',
                            type: 'Property',
                            source: {
                              name: 'concept',
                              type: 'OperandRef',
                            },
                          },
                        },
                      },
                    ],
                  },
                },
                operand: [
                  {
                    name: 'concept',
                    operandTypeSpecifier: {
                      name: '{http://hl7.org/fhir}CodeableConcept',
                      type: 'NamedTypeSpecifier',
                    },
                  },
                ],
              },
              {
                name: 'N0',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'N0',
                      expression: {
                        dataType: '{http://hl7.org/fhir}Observation',
                        codeProperty: 'code',
                        type: 'Retrieve',
                        codes: {
                          type: 'ToList',
                          operand: {
                            name: 'Regional lymph nodes.clinical [Class] Cancer code',
                            type: 'CodeRef',
                          },
                        },
                      },
                    },
                  ],
                  relationship: [],
                  where: {
                    type: 'Equivalent',
                    operand: [
                      {
                        name: 'ToConcept',
                        type: 'FunctionRef',
                        operand: [
                          {
                            strict: false,
                            type: 'As',
                            operand: {
                              path: 'value',
                              scope: 'N0',
                              type: 'Property',
                            },
                            asTypeSpecifier: {
                              name: '{http://hl7.org/fhir}CodeableConcept',
                              type: 'NamedTypeSpecifier',
                            },
                          },
                        ],
                      },
                      {
                        name: 'N0 category (finding)',
                        type: 'ConceptRef',
                      },
                    ],
                  },
                  return: {
                    expression: {
                      type: 'Tuple',
                      element: [
                        {
                          name: 'resourceType',
                          value: {
                            valueType: '{urn:hl7-org:elm-types:r1}String',
                            value: 'Observation',
                            type: 'Literal',
                          },
                        },
                        {
                          name: 'id',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'id',
                              scope: 'N0',
                              type: 'Property',
                            },
                          },
                        },
                        {
                          name: 'status',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'status',
                              scope: 'N0',
                              type: 'Property',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
              {
                name: 'N+',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'NLarge',
                      expression: {
                        dataType: '{http://hl7.org/fhir}Observation',
                        codeProperty: 'code',
                        type: 'Retrieve',
                        codes: {
                          type: 'ToList',
                          operand: {
                            name: 'Regional lymph nodes.clinical [Class] Cancer code',
                            type: 'CodeRef',
                          },
                        },
                      },
                    },
                  ],
                  let: [
                    {
                      identifier: 'NLargeConcept',
                      expression: {
                        name: 'ToConcept',
                        type: 'FunctionRef',
                        operand: [
                          {
                            strict: false,
                            type: 'As',
                            operand: {
                              path: 'value',
                              scope: 'NLarge',
                              type: 'Property',
                            },
                            asTypeSpecifier: {
                              name: '{http://hl7.org/fhir}CodeableConcept',
                              type: 'NamedTypeSpecifier',
                            },
                          },
                        ],
                      },
                    },
                  ],
                  relationship: [],
                  where: {
                    type: 'Null',
                  },
                  return: {
                    expression: {
                      type: 'Tuple',
                      element: [
                        {
                          name: 'resourceType',
                          value: {
                            valueType: '{urn:hl7-org:elm-types:r1}String',
                            value: 'Observation',
                            type: 'Literal',
                          },
                        },
                        {
                          name: 'id',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'id',
                              scope: 'NLarge',
                              type: 'Property',
                            },
                          },
                        },
                        {
                          name: 'status',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'status',
                              scope: 'NLarge',
                              type: 'Property',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
              {
                name: 'T > 2cm',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'TLarge',
                      expression: {
                        dataType: '{http://hl7.org/fhir}Observation',
                        codeProperty: 'code',
                        type: 'Retrieve',
                        codes: {
                          type: 'ToList',
                          operand: {
                            name: 'Primary tumor.clinical [Class] Cancer code',
                            type: 'CodeRef',
                          },
                        },
                      },
                    },
                  ],
                  let: [
                    {
                      identifier: 'TLageConcept',
                      expression: {
                        name: 'ToConcept',
                        type: 'FunctionRef',
                        operand: [
                          {
                            strict: false,
                            type: 'As',
                            operand: {
                              path: 'value',
                              scope: 'TLarge',
                              type: 'Property',
                            },
                            asTypeSpecifier: {
                              name: '{http://hl7.org/fhir}CodeableConcept',
                              type: 'NamedTypeSpecifier',
                            },
                          },
                        ],
                      },
                    },
                  ],
                  relationship: [],
                  where: {
                    type: 'Null',
                  },
                  return: {
                    expression: {
                      type: 'Tuple',
                      element: [
                        {
                          name: 'resourceType',
                          value: {
                            valueType: '{urn:hl7-org:elm-types:r1}String',
                            value: 'Observation',
                            type: 'Literal',
                          },
                        },
                        {
                          name: 'id',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'id',
                              scope: 'TLarge',
                              type: 'Property',
                            },
                          },
                        },
                        {
                          name: 'status',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'status',
                              scope: 'TLarge',
                              type: 'Property',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
              {
                name: 'T <= 2cm',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'TSmall',
                      expression: {
                        dataType: '{http://hl7.org/fhir}Observation',
                        codeProperty: 'code',
                        type: 'Retrieve',
                        codes: {
                          type: 'ToList',
                          operand: {
                            name: 'Primary tumor.clinical [Class] Cancer code',
                            type: 'CodeRef',
                          },
                        },
                      },
                    },
                  ],
                  relationship: [],
                  where: {
                    type: 'Or',
                    operand: [
                      {
                        type: 'Equivalent',
                        operand: [
                          {
                            name: 'ToConcept',
                            type: 'FunctionRef',
                            operand: [
                              {
                                strict: false,
                                type: 'As',
                                operand: {
                                  path: 'value',
                                  scope: 'TSmall',
                                  type: 'Property',
                                },
                                asTypeSpecifier: {
                                  name: '{http://hl7.org/fhir}CodeableConcept',
                                  type: 'NamedTypeSpecifier',
                                },
                              },
                            ],
                          },
                          {
                            name: 'T0 category (finding)',
                            type: 'ConceptRef',
                          },
                        ],
                      },
                      {
                        type: 'Equivalent',
                        operand: [
                          {
                            name: 'ToConcept',
                            type: 'FunctionRef',
                            operand: [
                              {
                                strict: false,
                                type: 'As',
                                operand: {
                                  path: 'value',
                                  scope: 'TSmall',
                                  type: 'Property',
                                },
                                asTypeSpecifier: {
                                  name: '{http://hl7.org/fhir}CodeableConcept',
                                  type: 'NamedTypeSpecifier',
                                },
                              },
                            ],
                          },
                          {
                            name: 'T1 category (finding)',
                            type: 'ConceptRef',
                          },
                        ],
                      },
                    ],
                  },
                  return: {
                    expression: {
                      type: 'Tuple',
                      element: [
                        {
                          name: 'resourceType',
                          value: {
                            valueType: '{urn:hl7-org:elm-types:r1}String',
                            value: 'Observation',
                            type: 'Literal',
                          },
                        },
                        {
                          name: 'id',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'id',
                              scope: 'TSmall',
                              type: 'Property',
                            },
                          },
                        },
                        {
                          name: 'status',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'status',
                              scope: 'TSmall',
                              type: 'Property',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
              {
                name: 'ChemotherapyTHWeekly',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'If',
                  condition: {
                    asType: '{urn:hl7-org:elm-types:r1}Boolean',
                    type: 'As',
                    operand: {
                      type: 'Exists',
                      operand: {
                        dataType: '{http://hl7.org/fhir}Procedure',
                        codeProperty: 'code',
                        type: 'Retrieve',
                        codes: {
                          type: 'ToList',
                          operand: {
                            name: 'Chemotherapy (procedure) code',
                            type: 'CodeRef',
                          },
                        },
                      },
                    },
                  },
                  then: {
                    type: 'Query',
                    source: [
                      {
                        alias: 'Chemo',
                        expression: {
                          dataType: '{http://hl7.org/fhir}Procedure',
                          codeProperty: 'code',
                          type: 'Retrieve',
                          codes: {
                            type: 'ToList',
                            operand: {
                              name: 'Chemotherapy (procedure) code',
                              type: 'CodeRef',
                            },
                          },
                        },
                      },
                    ],
                    relationship: [],
                    return: {
                      expression: {
                        type: 'Tuple',
                        element: [
                          {
                            name: 'resourceType',
                            value: {
                              valueType: '{urn:hl7-org:elm-types:r1}String',
                              value: 'Procedure',
                              type: 'Literal',
                            },
                          },
                          {
                            name: 'id',
                            value: {
                              path: 'value',
                              type: 'Property',
                              source: {
                                path: 'id',
                                scope: 'Chemo',
                                type: 'Property',
                              },
                            },
                          },
                          {
                            name: 'status',
                            value: {
                              path: 'value',
                              type: 'Property',
                              source: {
                                path: 'status',
                                scope: 'Chemo',
                                type: 'Property',
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                  else: {
                    type: 'Query',
                    source: [
                      {
                        alias: 'Request',
                        expression: {
                          dataType: '{http://hl7.org/fhir}ServiceRequest',
                          codeProperty: 'code',
                          type: 'Retrieve',
                          codes: {
                            type: 'ToList',
                            operand: {
                              name: 'Chemotherapy (procedure) code',
                              type: 'CodeRef',
                            },
                          },
                        },
                      },
                    ],
                    relationship: [],
                    return: {
                      expression: {
                        type: 'Tuple',
                        element: [
                          {
                            name: 'resourceType',
                            value: {
                              valueType: '{urn:hl7-org:elm-types:r1}String',
                              value: 'ServiceRequest',
                              type: 'Literal',
                            },
                          },
                          {
                            name: 'id',
                            value: {
                              path: 'value',
                              type: 'Property',
                              source: {
                                path: 'id',
                                scope: 'Request',
                                type: 'Property',
                              },
                            },
                          },
                          {
                            name: 'status',
                            value: {
                              path: 'value',
                              type: 'Property',
                              source: {
                                path: 'status',
                                scope: 'Request',
                                type: 'Property',
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
              {
                name: 'ChemotherapyTCHAC+TH',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'If',
                  condition: {
                    asType: '{urn:hl7-org:elm-types:r1}Boolean',
                    type: 'As',
                    operand: {
                      type: 'Exists',
                      operand: {
                        dataType: '{http://hl7.org/fhir}Procedure',
                        codeProperty: 'code',
                        type: 'Retrieve',
                        codes: {
                          type: 'ToList',
                          operand: {
                            name: 'Chemotherapy (procedure) code',
                            type: 'CodeRef',
                          },
                        },
                      },
                    },
                  },
                  then: {
                    type: 'Query',
                    source: [
                      {
                        alias: 'Chemo',
                        expression: {
                          dataType: '{http://hl7.org/fhir}Procedure',
                          codeProperty: 'code',
                          type: 'Retrieve',
                          codes: {
                            type: 'ToList',
                            operand: {
                              name: 'Chemotherapy (procedure) code',
                              type: 'CodeRef',
                            },
                          },
                        },
                      },
                    ],
                    relationship: [],
                    return: {
                      expression: {
                        type: 'Tuple',
                        element: [
                          {
                            name: 'resourceType',
                            value: {
                              valueType: '{urn:hl7-org:elm-types:r1}String',
                              value: 'Procedure',
                              type: 'Literal',
                            },
                          },
                          {
                            name: 'id',
                            value: {
                              path: 'value',
                              type: 'Property',
                              source: {
                                path: 'id',
                                scope: 'Chemo',
                                type: 'Property',
                              },
                            },
                          },
                          {
                            name: 'status',
                            value: {
                              path: 'value',
                              type: 'Property',
                              source: {
                                path: 'status',
                                scope: 'Chemo',
                                type: 'Property',
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                  else: {
                    type: 'Query',
                    source: [
                      {
                        alias: 'Request',
                        expression: {
                          dataType: '{http://hl7.org/fhir}ServiceRequest',
                          codeProperty: 'code',
                          type: 'Retrieve',
                          codes: {
                            type: 'ToList',
                            operand: {
                              name: 'Chemotherapy (procedure) code',
                              type: 'CodeRef',
                            },
                          },
                        },
                      },
                    ],
                    relationship: [],
                    return: {
                      expression: {
                        type: 'Tuple',
                        element: [
                          {
                            name: 'resourceType',
                            value: {
                              valueType: '{urn:hl7-org:elm-types:r1}String',
                              value: 'ServiceRequest',
                              type: 'Literal',
                            },
                          },
                          {
                            name: 'id',
                            value: {
                              path: 'value',
                              type: 'Property',
                              source: {
                                path: 'id',
                                scope: 'Request',
                                type: 'Property',
                              },
                            },
                          },
                          {
                            name: 'status',
                            value: {
                              path: 'value',
                              type: 'Property',
                              source: {
                                path: 'status',
                                scope: 'Request',
                                type: 'Property',
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
              {
                name: 'PostchemotherapyTrastuzumabRequest',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'PCT',
                      expression: {
                        dataType: '{http://hl7.org/fhir}MedicationRequest',
                        codeProperty: 'medication',
                        type: 'Retrieve',
                        codes: {
                          type: 'ToList',
                          operand: {
                            name: 'trastuzumab 150 MG Injection code',
                            type: 'CodeRef',
                          },
                        },
                      },
                    },
                  ],
                  relationship: [],
                  return: {
                    expression: {
                      type: 'Tuple',
                      element: [
                        {
                          name: 'resourceType',
                          value: {
                            valueType: '{urn:hl7-org:elm-types:r1}String',
                            value: 'MedicationRequest',
                            type: 'Literal',
                          },
                        },
                        {
                          name: 'id',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'id',
                              scope: 'PCT',
                              type: 'Property',
                            },
                          },
                        },
                        {
                          name: 'status',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'status',
                              scope: 'PCT',
                              type: 'Property',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
              {
                name: 'PostchemotherapyTrastuzumabAdministration',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'Trastuzumab',
                      expression: {
                        type: 'Null',
                      },
                    },
                  ],
                  relationship: [],
                  return: {
                    expression: {
                      type: 'Null',
                    },
                  },
                },
              },
              {
                name: 'ERNegative',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'Neg',
                      expression: {
                        type: 'Null',
                      },
                    },
                  ],
                  relationship: [],
                  where: {
                    type: 'Null',
                  },
                  return: {
                    expression: {
                      type: 'Null',
                    },
                  },
                },
              },
              {
                name: 'ERPositive',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'Pos',
                      expression: {
                        type: 'Null',
                      },
                    },
                  ],
                  relationship: [],
                  where: {
                    type: 'Null',
                  },
                  return: {
                    expression: {
                      type: 'Null',
                    },
                  },
                },
              },
            ],
          },
        },
      },
      preconditions: {
        library: {
          identifier: {
            id: 'mCODEResources',
            version: '1',
          },
          schemaIdentifier: {
            id: 'urn:hl7-org:elm',
            version: 'r1',
          },
          usings: {
            def: [
              {
                localIdentifier: 'System',
                uri: 'urn:hl7-org:elm-types:r1',
              },
              {
                localIdentifier: 'FHIR',
                uri: 'http://hl7.org/fhir',
                version: '4.0.0',
              },
            ],
          },
          codeSystems: {
            def: [
              {
                name: 'SNOMEDCT',
                id: 'http://snomed.info/sct',
                accessLevel: 'Public',
              },
              {
                name: 'LOINC',
                id: 'http://loinc.org',
                accessLevel: 'Public',
              },
              {
                name: 'RXNORM',
                id: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                accessLevel: 'Public',
              },
            ],
          },
          codes: {
            def: [
              {
                name: 'Primary tumor.clinical [Class] Cancer code',
                id: '21905-5',
                display: 'Primary tumor.clinical [Class] Cancer',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'LOINC',
                },
              },
              {
                name: 'Regional lymph nodes.clinical [Class] Cancer code',
                id: '21906-3',
                display: 'Regional lymph nodes.clinical [Class] Cancer',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'LOINC',
                },
              },
              {
                name: 'HER2 [Presence] in Breast cancer specimen by Immune stain code',
                id: '85319-2',
                display: 'HER2 [Presence] in Breast cancer specimen by Immune stain',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'LOINC',
                },
              },
              {
                name: 'T0 category (finding) code',
                id: '58790005',
                display: 'T0 category (finding)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'T1 category (finding) code',
                id: '23351008',
                display: 'T1 category (finding)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'N0 category (finding) code',
                id: '62455006',
                display: 'N0 category (finding)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'N1 category (finding) code',
                id: '53623008',
                display: 'N1 category (finding)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Lumpectomy of breast (procedure) code',
                id: '392021009',
                display: 'Lumpectomy of breast (procedure)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Teleradiotherapy procedure (procedure) code',
                id: '33195004',
                display: 'Teleradiotherapy procedure (procedure)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Chemotherapy (procedure) code',
                id: '367336001',
                display: 'Chemotherapy (procedure)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: '14 ML pertuzumab 30 MG/ML Injection code',
                id: '1298948',
                display: '14 ML pertuzumab 30 MG/ML Injection',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'RXNORM',
                },
              },
              {
                name: 'Cyclophosphamide 1000 MG Injection code',
                id: '1734919',
                display: 'Cyclophosphamide 1000 MG Injection',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'RXNORM',
                },
              },
              {
                name: 'trastuzumab 150 MG Injection code',
                id: '1922509',
                display: 'trastuzumab 150 MG Injection',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'RXNORM',
                },
              },
              {
                name: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection code',
                id: '1790099',
                display: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'RXNORM',
                },
              },
              {
                name: '11p partial monosomy syndrome 4135001 code',
                id: '4135001',
                display: '11p partial monosomy syndrome',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Orbital lymphoma 13048006 code',
                id: '13048006',
                display: 'Orbital lymphoma',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Delta heavy chain disease 20224008 code',
                id: '20224008',
                display: 'Delta heavy chain disease',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Malignant neoplasm of breast 254837009 code',
                id: '254837009',
                display: 'Malignant neoplasm of breast',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Primary malignant neoplasm of colon 93761005 code',
                id: '93761005',
                display: 'Primary malignant neoplasm of colon',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Secondary malignant neoplasm of colon 94260004 code',
                id: '94260004',
                display: 'Secondary malignant neoplasm of colon',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Carcinoma in situ of prostate (disorder) 92691004 code',
                id: '92691004',
                display: 'Carcinoma in situ of prostate (disorder)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Small cell carcinoma of lung (disorder) 254632001 code',
                id: '254632001',
                display: 'Small cell carcinoma of lung (disorder)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Non-small cell lung cancer (disorder) 254637007 code',
                id: '254637007',
                display: 'Non-small cell lung cancer (disorder)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
            ],
          },
          concepts: {
            def: [
              {
                name: 'T0 category (finding)',
                display: 'T0 category (finding)',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'T0 category (finding) code',
                  },
                ],
              },
              {
                name: 'T1 category (finding)',
                display: 'T1 category (finding)',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'T1 category (finding) code',
                  },
                ],
              },
              {
                name: 'N0 category (finding)',
                display: 'N0 category (finding)',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'N0 category (finding) code',
                  },
                ],
              },
              {
                name: 'N1 category (finding)',
                display: 'N1 category (finding)',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'N1 category (finding) code',
                  },
                ],
              },
              {
                name: '14 ML pertuzumab 30 MG/ML Injection',
                display: '14 ML pertuzumab 30 MG/ML Injection',
                accessLevel: 'Public',
                code: [
                  {
                    name: '14 ML pertuzumab 30 MG/ML Injection code',
                  },
                ],
              },
              {
                name: 'Cyclophosphamide 1000 MG Injection',
                display: 'Cyclophosphamide 1000 MG Injection',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'Cyclophosphamide 1000 MG Injection code',
                  },
                ],
              },
              {
                name: 'trastuzumab 150 MG Injection',
                display: 'trastuzumab 150 MG Injection',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'trastuzumab 150 MG Injection code',
                  },
                ],
              },
              {
                name: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection',
                display: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection',
                accessLevel: 'Public',
                code: [
                  {
                    name: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection code',
                  },
                ],
              },
              {
                name: 'HER2 [Presence] in Breast cancer specimen by Immune stain',
                display: 'HER2 [Presence] in Breast cancer specimen by Immune stain',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'HER2 [Presence] in Breast cancer specimen by Immune stain code',
                  },
                ],
              },
              {
                name: 'Primary cancers',
                accessLevel: 'Public',
                code: [
                  {
                    name: '11p partial monosomy syndrome 4135001 code',
                  },
                  {
                    name: 'Orbital lymphoma 13048006 code',
                  },
                  {
                    name: 'Delta heavy chain disease 20224008 code',
                  },
                  {
                    name: 'Malignant neoplasm of breast 254837009 code',
                  },
                  {
                    name: 'Primary malignant neoplasm of colon 93761005 code',
                  },
                  {
                    name: 'Secondary malignant neoplasm of colon 94260004 code',
                  },
                  {
                    name: 'Carcinoma in situ of prostate (disorder) 92691004 code',
                  },
                  {
                    name: 'Small cell carcinoma of lung (disorder) 254632001 code',
                  },
                  {
                    name: 'Non-small cell lung cancer (disorder) 254637007 code',
                  },
                ],
              },
            ],
          },
          statements: {
            def: [
              {
                name: 'Patient',
                context: 'Patient',
                expression: {
                  type: 'SingletonFrom',
                  operand: {
                    dataType: '{http://hl7.org/fhir}Patient',
                    type: 'Retrieve',
                  },
                },
              },
              {
                name: 'Primary Cancer Condition',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'Cancer',
                      expression: {
                        dataType: '{http://hl7.org/fhir}Condition',
                        codeProperty: 'code',
                        type: 'Retrieve',
                        codes: {
                          type: 'ToList',
                          operand: {
                            name: 'Primary cancers',
                            type: 'ConceptRef',
                          },
                        },
                      },
                    },
                  ],
                  relationship: [],
                },
              },
              {
                name: 'ToCode',
                context: 'Patient',
                accessLevel: 'Public',
                type: 'FunctionDef',
                expression: {
                  type: 'If',
                  condition: {
                    asType: '{urn:hl7-org:elm-types:r1}Boolean',
                    type: 'As',
                    operand: {
                      type: 'IsNull',
                      operand: {
                        name: 'coding',
                        type: 'OperandRef',
                      },
                    },
                  },
                  then: {
                    asType: '{urn:hl7-org:elm-types:r1}Code',
                    type: 'As',
                    operand: {
                      type: 'Null',
                    },
                  },
                  else: {
                    classType: '{urn:hl7-org:elm-types:r1}Code',
                    type: 'Instance',
                    element: [
                      {
                        name: 'code',
                        value: {
                          path: 'value',
                          type: 'Property',
                          source: {
                            path: 'code',
                            type: 'Property',
                            source: {
                              name: 'coding',
                              type: 'OperandRef',
                            },
                          },
                        },
                      },
                      {
                        name: 'system',
                        value: {
                          path: 'value',
                          type: 'Property',
                          source: {
                            path: 'system',
                            type: 'Property',
                            source: {
                              name: 'coding',
                              type: 'OperandRef',
                            },
                          },
                        },
                      },
                      {
                        name: 'version',
                        value: {
                          path: 'value',
                          type: 'Property',
                          source: {
                            path: 'version',
                            type: 'Property',
                            source: {
                              name: 'coding',
                              type: 'OperandRef',
                            },
                          },
                        },
                      },
                      {
                        name: 'display',
                        value: {
                          path: 'value',
                          type: 'Property',
                          source: {
                            path: 'display',
                            type: 'Property',
                            source: {
                              name: 'coding',
                              type: 'OperandRef',
                            },
                          },
                        },
                      },
                    ],
                  },
                },
                operand: [
                  {
                    name: 'coding',
                    operandTypeSpecifier: {
                      name: '{http://hl7.org/fhir}Coding',
                      type: 'NamedTypeSpecifier',
                    },
                  },
                ],
              },
              {
                name: 'ToConcept',
                context: 'Patient',
                accessLevel: 'Public',
                type: 'FunctionDef',
                expression: {
                  type: 'If',
                  condition: {
                    asType: '{urn:hl7-org:elm-types:r1}Boolean',
                    type: 'As',
                    operand: {
                      type: 'IsNull',
                      operand: {
                        name: 'concept',
                        type: 'OperandRef',
                      },
                    },
                  },
                  then: {
                    asType: '{urn:hl7-org:elm-types:r1}Concept',
                    type: 'As',
                    operand: {
                      type: 'Null',
                    },
                  },
                  else: {
                    classType: '{urn:hl7-org:elm-types:r1}Concept',
                    type: 'Instance',
                    element: [
                      {
                        name: 'codes',
                        value: {
                          type: 'Query',
                          source: [
                            {
                              alias: 'C',
                              expression: {
                                path: 'coding',
                                type: 'Property',
                                source: {
                                  name: 'concept',
                                  type: 'OperandRef',
                                },
                              },
                            },
                          ],
                          relationship: [],
                          return: {
                            expression: {
                              name: 'ToCode',
                              type: 'FunctionRef',
                              operand: [
                                {
                                  name: 'C',
                                  type: 'AliasRef',
                                },
                              ],
                            },
                          },
                        },
                      },
                      {
                        name: 'display',
                        value: {
                          path: 'value',
                          type: 'Property',
                          source: {
                            path: 'text',
                            type: 'Property',
                            source: {
                              name: 'concept',
                              type: 'OperandRef',
                            },
                          },
                        },
                      },
                    ],
                  },
                },
                operand: [
                  {
                    name: 'concept',
                    operandTypeSpecifier: {
                      name: '{http://hl7.org/fhir}CodeableConcept',
                      type: 'NamedTypeSpecifier',
                    },
                  },
                ],
              },
              {
                name: 'Condition',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'PrimaryCancer',
                      expression: {
                        name: 'Primary Cancer Condition',
                        type: 'ExpressionRef',
                      },
                    },
                  ],
                  relationship: [],
                  return: {
                    expression: {
                      type: 'Tuple',
                      element: [
                        {
                          name: 'value',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'text',
                              type: 'Property',
                              source: {
                                path: 'code',
                                scope: 'PrimaryCancer',
                                type: 'Property',
                              },
                            },
                          },
                        },
                        {
                          name: 'match',
                          value: {
                            type: 'Equivalent',
                            operand: [
                              {
                                path: 'value',
                                type: 'Property',
                                source: {
                                  path: 'text',
                                  type: 'Property',
                                  source: {
                                    path: 'code',
                                    scope: 'PrimaryCancer',
                                    type: 'Property',
                                  },
                                },
                              },
                              {
                                valueType: '{urn:hl7-org:elm-types:r1}String',
                                value: 'Malignant neoplasm of breast (disorder)',
                                type: 'Literal',
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
              },
              {
                name: 'HER2 Status',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'Her2',
                      expression: {
                        dataType: '{http://hl7.org/fhir}Observation',
                        codeProperty: 'code',
                        type: 'Retrieve',
                        codes: {
                          type: 'ToList',
                          operand: {
                            name: 'HER2 [Presence] in Breast cancer specimen by Immune stain',
                            type: 'ConceptRef',
                          },
                        },
                      },
                    },
                  ],
                  relationship: [],
                  return: {
                    expression: {
                      type: 'Tuple',
                      element: [
                        {
                          name: 'value',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'text',
                              type: 'Property',
                              source: {
                                path: 'value',
                                scope: 'Her2',
                                type: 'Property',
                              },
                            },
                          },
                        },
                        {
                          name: 'match',
                          value: {
                            type: 'Equivalent',
                            operand: [
                              {
                                path: 'value',
                                type: 'Property',
                                source: {
                                  path: 'text',
                                  type: 'Property',
                                  source: {
                                    path: 'value',
                                    scope: 'Her2',
                                    type: 'Property',
                                  },
                                },
                              },
                              {
                                valueType: '{urn:hl7-org:elm-types:r1}String',
                                value: 'Positive',
                                type: 'Literal',
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'eNPAgToBD',
    name: 'Breast Cancer: Neoadjuvant Chemotherapy with Surgery ',
    description:
      'Pathway for the Early Stage HER2+ Breast Cancer Pathway for neoadjuvant chemotherapy with surgery.',
    library: ['mCODE_Library.cql'],
    preconditions: [
      {
        id: '1',
        elementName: 'Condition',
        expected: 'Breast Cancer',
        cql:
          '"Primary Cancer Condition" PrimaryCancer return Tuple{ value: PrimaryCancer.code.text.value, match: PrimaryCancer.code.text.value ~ \'Malignant neoplasm of breast (disorder)\' } ',
      },
      {
        id: '2',
        elementName: 'HER2 Status',
        expected: '+',
        cql:
          '[Observation: "HER2 [Presence] in Breast cancer specimen by Immune stain"] Her2 return Tuple{ value: Her2.value.text.value, match: Her2.value.text.value ~ \'Positive\' } ',
      },
    ],
    nodes: {
      Start: {
        key: 'Start',
        label: 'Start',
        type: 'start',
        transitions: [
          {
            id: '1',
            transition: 'TumorSize',
          },
        ],
      },
      TumorSize: {
        key: 'TumorSize',
        label: 'Tumor Size',
        type: 'branch',
        transitions: [
          {
            id: '1',
            transition: 'ChemotherapyTCHP',
            condition: {
              description: 'T > 2',
              cql:
                '[Observation: "Primary tumor.clinical [Class] Cancer code"] TLarge let TLageConcept: ToConcept(TLarge.value as FHIR.CodeableConcept) where TLageConcept ~ "T3 category (finding)" or TLageConcept ~ "T4 category (finding)" return Tuple{ resourceType: \'Observation\', id: TLarge.id.value , status: TLarge.status.value} ',
            },
          },
          {
            id: '2',
            transition: 'ChemotherapyACTHP',
            condition: {
              description: 'T > 2',
              cql:
                '[Observation: "Primary tumor.clinical [Class] Cancer code"] TLarge let TLageConcept: ToConcept(TLarge.value as FHIR.CodeableConcept) where TLageConcept ~ "T3 category (finding)" or TLageConcept ~ "T4 category (finding)" return Tuple{ resourceType: \'Observation\', id: TLarge.id.value , status: TLarge.status.value} ',
            },
          },
          {
            id: '3',
            transition: 'ChemotherapyddACTHP',
            condition: {
              description: 'T > 2',
              cql:
                '[Observation: "Primary tumor.clinical [Class] Cancer code"] TLarge let TLageConcept: ToConcept(TLarge.value as FHIR.CodeableConcept) where TLageConcept ~ "T3 category (finding)" or TLageConcept ~ "T4 category (finding)" return Tuple{ resourceType: \'Observation\', id: TLarge.id.value , status: TLarge.status.value} ',
            },
          },
          {
            id: '4',
            transition: 'NodeStatus',
            condition: {
              description: 'T <= 2',
              cql:
                '[Observation: "Primary tumor.clinical [Class] Cancer code"] TSmall where ToConcept(TSmall.value as FHIR.CodeableConcept) ~ "T0 category (finding)" or ToConcept(TSmall.value as FHIR.CodeableConcept) ~ "T1 category (finding)" or ToConcept(TSmall.value as FHIR.CodeableConcept) ~ "T2 category (finding)" return Tuple{ resourceType: \'Observation\', id: TSmall.id.value , status: TSmall.status.value} ',
            },
          },
        ],
      },
      NodeStatus: {
        key: 'NodeStatus',
        label: 'Node Status',
        type: 'branch',
        transitions: [
          {
            id: '1',
            transition: 'ChemotherapyTCHP',
            condition: {
              description: 'N+',
              cql:
                '[Observation: "Regional lymph nodes.clinical [Class] Cancer code"] NLarge let NLargeConcept: ToConcept(NLarge.value as FHIR.CodeableConcept) where NLargeConcept ~ "N1 category (finding)" or NLargeConcept ~ "N2 category (finding)" or NLargeConcept ~ "N3 category (finding)" return Tuple{ resourceType: \'Observation\', id: NLarge.id.value , status: NLarge.status.value} ',
            },
          },
          {
            id: '2',
            transition: 'ChemotherapyACTHP',
            condition: {
              description: 'N+',
              cql:
                '[Observation: "Regional lymph nodes.clinical [Class] Cancer code"] NLarge let NLargeConcept: ToConcept(NLarge.value as FHIR.CodeableConcept) where NLargeConcept ~ "N1 category (finding)" or NLargeConcept ~ "N2 category (finding)" or NLargeConcept ~ "N3 category (finding)" return Tuple{ resourceType: \'Observation\', id: NLarge.id.value , status: NLarge.status.value} ',
            },
          },
          {
            id: '3',
            transition: 'ChemotherapyddACTHP',
            condition: {
              description: 'N+',
              cql:
                '[Observation: "Regional lymph nodes.clinical [Class] Cancer code"] NLarge let NLargeConcept: ToConcept(NLarge.value as FHIR.CodeableConcept) where NLargeConcept ~ "N1 category (finding)" or NLargeConcept ~ "N2 category (finding)" or NLargeConcept ~ "N3 category (finding)" return Tuple{ resourceType: \'Observation\', id: NLarge.id.value , status: NLarge.status.value} ',
            },
          },
          {
            id: '4',
            transition: 'Surgery1',
            condition: {
              description: 'N0',
              cql:
                '[Observation: "Regional lymph nodes.clinical [Class] Cancer code"] N0 where ToConcept(N0.value as FHIR.CodeableConcept) ~ "N0 category (finding)" return Tuple{ resourceType: \'Observation\', id: N0.id.value , status: N0.status.value} ',
            },
          },
        ],
      },
      Surgery1: {
        key: 'Surgery1',
        label: 'Surgery',
        type: 'action',
        action: {
          id: '1',
          type: 'create',
          description: 'Cancer Related Surgery Procedure',
          resource: {
            resourceType: 'ServiceRequest',
            code: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '392021009',
                  display: 'Lumpectomy of breast (procedure)',
                },
              ],
              text: 'Lumpectomy of breast (procedure)',
            },
          },
        },
        cql:
          'if exists [Procedure: "Lumpectomy of breast (procedure) code"] then [Procedure: "Lumpectomy of breast (procedure) code"] Lumpectomy return Tuple{ resourceType: \'Procedure\', id: Lumpectomy.id.value, status: Lumpectomy.status.value } else [ServiceRequest: "Lumpectomy of breast (procedure) code"] Request return Tuple{ resourceType: \'ServiceRequest\', id: Request.id.value, status: Request.status.value }',
        transitions: [
          {
            id: '1',
            transition: 'PaclitaxelTrastuzumab',
          },
        ],
      },
      PaclitaxelTrastuzumab: {
        key: 'PaclitaxelTrastuzumab',
        label: 'Paclitaxel and Trastuzumab',
        type: 'action',
        action: {
          id: '1',
          type: 'create',
          description: 'Paclitaxel request',
          resource: {
            resourceType: 'MedicationRequest',
            medicationCodeableConcept: {
              coding: [
                {
                  system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                  code: '583214',
                  display: 'PACLitaxel',
                },
              ],
              text: 'PACLitaxel',
            },
          },
        },
        cql:
          '[MedicationRequest: "paclitaxel code"] MR return Tuple{ resourceType: \'MedicationRequest\', id: MR.id.value , status: MR.status.value} ',
        transitions: [],
      },
      ChemotherapyTCHP: {
        key: 'ChemotherapyTCHP',
        label: 'Chemotherapy TCHP',
        type: 'action',
        action: {
          id: '1',
          type: 'create',
          description: 'Doxorubicin Medication request',
          resource: {
            resourceType: 'MedicationRequest',
            medicationCodeableConcept: {
              coding: [
                {
                  system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                  code: '1790099',
                  display: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection',
                },
              ],
              text: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection',
            },
          },
        },
        cql:
          '[MedicationRequest: "10 ML Doxorubicin Hydrochloride 2 MG/ML Injection code"] MR where ToConcept(MR.medication as FHIR.CodeableConcept) ~ "10 ML Doxorubicin Hydrochloride 2 MG/ML Injection"return Tuple{ resourceType: \'MedicationRequest\', id: MR.id.value, status: MR.status.value }',
        transitions: [
          {
            id: '1',
            transition: 'Surgery2',
          },
        ],
      },
      ChemotherapyACTHP: {
        key: 'ChemotherapyACTHP',
        label: 'Chemotherapy ACTHP',
        type: 'action',
        action: {
          id: '1',
          type: 'create',
          description: 'Cyclophosphamide Medication request',
          resource: {
            resourceType: 'MedicationRequest',
            medicationCodeableConcept: {
              coding: [
                {
                  system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                  code: '1734919',
                  display: 'Cyclophosphamide 1000 MG Injection',
                },
              ],
              text: 'Cyclophosphamide 1000 MG Injection',
            },
          },
        },
        cql:
          '[MedicationRequest: "Cyclophosphamide 1000 MG Injection code"] MR where ToConcept(MR.medication as FHIR.CodeableConcept) ~ "Cyclophosphamide 1000 MG Injection" return Tuple{ resourceType: \'MedicationRequest\', id: MR.id.value , status: MR.status.value} ',
        transitions: [
          {
            id: '1',
            transition: 'Surgery2',
          },
        ],
      },
      ChemotherapyddACTHP: {
        key: 'ChemotherapyddACTHP',
        label: 'Chemotherapy ddACTHP',
        type: 'action',
        action: {
          id: '1',
          type: 'create',
          description: 'Pertuzumab Medication request',
          resource: {
            resourceType: 'MedicationRequest',
            medicationCodeableConcept: {
              coding: [
                {
                  system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                  code: '1298948',
                  display: '14 ML pertuzumab 30 MG/ML Injection',
                },
              ],
              text: '14 ML pertuzumab 30 MG/ML Injection',
            },
          },
        },
        cql:
          '[MedicationRequest: "14 ML pertuzumab 30 MG/ML Injection code"] MR where ToConcept(MR.medication as FHIR.CodeableConcept) ~ "14 ML pertuzumab 30 MG/ML Injection" return Tuple{ resourceType: \'MedicationRequest\', id: MR.id.value , status: MR.status.value} ',
        transitions: [
          {
            id: '1',
            transition: 'Surgery2',
          },
        ],
      },
      Surgery2: {
        key: 'Surgery2',
        label: 'Surgery',
        type: 'action',
        action: {
          id: '1',
          type: 'create',
          description: 'Cancer Related Surgery Procedure',
          resource: {
            resourceType: 'ServiceRequest',
            code: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '392021009',
                  display: 'Lumpectomy of breast (procedure)',
                },
              ],
              text: 'Lumpectomy of breast (procedure)',
            },
          },
        },
        cql:
          'if exists [Procedure: "Lumpectomy of breast (procedure) code"] then [Procedure: "Lumpectomy of breast (procedure) code"] Lumpectomy return Tuple{ resourceType: \'Procedure\', id: Lumpectomy.id.value, status: Lumpectomy.status.value } else [ServiceRequest: "Lumpectomy of breast (procedure) code"] Request return Tuple{ resourceType: \'ServiceRequest\', id: Request.id.value, status: Request.status.value }',
        transitions: [
          {
            id: '1',
            transition: 'PathologicalResponse',
          },
        ],
      },
      PathologicalResponse: {
        key: 'PathologicalResponse',
        label: 'Pathological Response',
        type: 'branch',
        transitions: [
          {
            id: '1',
            transition: 'NodeStatus2',
            condition: {
              description: 'Complete',
              cql:
                '[Observation "Pathologic response code"] Response where ToConcept(Response.value as FHIR.CodeableConcept) ~ "Complete" return Tuple{ resourceType: \'Observation\', id: Response.id.value, status: Response.status.value} ',
            },
          },
          {
            id: '2',
            transition: 'AdotrastuzumabEmtansine',
            condition: {
              description: 'Partial/Stable/Progressive',
              cql:
                '[Observation "Pathologic response code"] Response let ResponseConcept: ToConcept(Response.value as FHIR.CodeableConcept) where ResponseConcept ~ "Partial" or ResponseConcept ~ "Stable" or ResponseConcept ~ "Progressive" return Tuple{ resourceType: \'Observation\', id: Response.id.value, status: Response.status.value} ',
            },
          },
        ],
      },
      AdotrastuzumabEmtansine: {
        key: 'AdotrastuzumabEmtansine',
        label: 'Ado-trastuzumab Emtansine',
        type: 'action',
        action: {
          id: '1',
          type: 'create',
          description: 'Ado-trastuzumab Emtansine Request',
          resource: {
            resourceType: 'MedicationRequest',
            medicationCodeableConcept: {
              coding: [
                {
                  system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                  code: '1658084',
                  display: 'ado-trastuzumab emtansine',
                },
              ],
              text: 'ado-trastuzumab emtansine',
            },
          },
        },
        cql:
          '[MedicationRequest: "adotrastuzumab emtansine code"] MR return Tuple{ resourceType: \'MedicationRequest\', id: MR.id.value , status: MR.status.value} ',
        transitions: [],
      },
      NodeStatus2: {
        key: 'NodeStatus2',
        label: 'Node Status Prior to Surgery',
        type: 'branch',
        transitions: [
          {
            id: '1',
            transition: 'Trastuzumab',
            condition: {
              description: 'N0',
              cql:
                '[Observation: "Regional lymph nodes.clinical [Class] Cancer code"] N0 where ToConcept(N0.value as FHIR.CodeableConcept) ~ "N0 category (finding)" return Tuple{ resourceType: \'Observation\', id: N0.id.value , status: N0.status.value} ',
            },
          },
          {
            id: '2',
            transition: 'PertuzumabTrastuzumab',
            condition: {
              description: 'N+',
              cql:
                ' [Observation: "Regional lymph nodes.clinical [Class] Cancer code"] NLarge let NLargeConcept: ToConcept(NLarge.value as FHIR.CodeableConcept) where NLargeConcept ~ "N1 category (finding)" or NLargeConcept ~ "N2 category (finding)" or NLargeConcept ~ "N3 category (finding)" return Tuple{ resourceType: \'Observation\', id: NLarge.id.value , status: NLarge.status.value} ',
            },
          },
        ],
      },
      Trastuzumab: {
        key: 'Trastuzumab',
        label: 'Trastuzumab',
        type: 'action',
        action: {
          id: '1',
          type: 'create',
          description: 'Trastuzumab request',
          resource: {
            resourceType: 'MedicationRequest',
            medicationCodeableConcept: {
              coding: [
                {
                  system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                  code: '1922509',
                  display: 'trastuzumab',
                },
              ],
              text: 'trastuzumab',
            },
          },
        },
        cql:
          '[MedicationRequest: "trastuzumab code"] MR return Tuple{ resourceType: \'MedicationRequest\', id: MR.id.value , status: MR.status.value} ',
        transitions: [],
      },
      PertuzumabTrastuzumab: {
        key: 'PertuzumabTrastuzumab',
        label: 'Pertuzumab and Trastuzumab',
        type: 'action',
        action: {
          id: '1',
          type: 'create',
          description: 'Pertuzumab request',
          resource: {
            resourceType: 'MedicationRequest',
            medicationCodeableConcept: {
              coding: [
                {
                  system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                  code: '1298948',
                  display: 'pertuzumab',
                },
              ],
              text: 'pertuzumab',
            },
          },
        },
        cql:
          '[MedicationRequest: "pertuzumab code"] MR return Tuple{ resourceType: \'MedicationRequest\', id: MR.id.value , status: MR.status.value} ',
        transitions: [],
      },
    },
    elm: {
      navigational: {
        library: {
          identifier: {
            id: 'mCODEResources',
            version: '1',
          },
          schemaIdentifier: {
            id: 'urn:hl7-org:elm',
            version: 'r1',
          },
          usings: {
            def: [
              {
                localIdentifier: 'System',
                uri: 'urn:hl7-org:elm-types:r1',
              },
              {
                localIdentifier: 'FHIR',
                uri: 'http://hl7.org/fhir',
                version: '4.0.0',
              },
            ],
          },
          codeSystems: {
            def: [
              {
                name: 'SNOMEDCT',
                id: 'http://snomed.info/sct',
                accessLevel: 'Public',
              },
              {
                name: 'LOINC',
                id: 'http://loinc.org',
                accessLevel: 'Public',
              },
              {
                name: 'RXNORM',
                id: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                accessLevel: 'Public',
              },
            ],
          },
          codes: {
            def: [
              {
                name: 'Primary tumor.clinical [Class] Cancer code',
                id: '21905-5',
                display: 'Primary tumor.clinical [Class] Cancer',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'LOINC',
                },
              },
              {
                name: 'Regional lymph nodes.clinical [Class] Cancer code',
                id: '21906-3',
                display: 'Regional lymph nodes.clinical [Class] Cancer',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'LOINC',
                },
              },
              {
                name: 'HER2 [Presence] in Breast cancer specimen by Immune stain code',
                id: '85319-2',
                display: 'HER2 [Presence] in Breast cancer specimen by Immune stain',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'LOINC',
                },
              },
              {
                name: 'T0 category (finding) code',
                id: '58790005',
                display: 'T0 category (finding)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'T1 category (finding) code',
                id: '23351008',
                display: 'T1 category (finding)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'N0 category (finding) code',
                id: '62455006',
                display: 'N0 category (finding)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'N1 category (finding) code',
                id: '53623008',
                display: 'N1 category (finding)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Lumpectomy of breast (procedure) code',
                id: '392021009',
                display: 'Lumpectomy of breast (procedure)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Teleradiotherapy procedure (procedure) code',
                id: '33195004',
                display: 'Teleradiotherapy procedure (procedure)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Chemotherapy (procedure) code',
                id: '367336001',
                display: 'Chemotherapy (procedure)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: '14 ML pertuzumab 30 MG/ML Injection code',
                id: '1298948',
                display: '14 ML pertuzumab 30 MG/ML Injection',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'RXNORM',
                },
              },
              {
                name: 'Cyclophosphamide 1000 MG Injection code',
                id: '1734919',
                display: 'Cyclophosphamide 1000 MG Injection',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'RXNORM',
                },
              },
              {
                name: 'trastuzumab 150 MG Injection code',
                id: '1922509',
                display: 'trastuzumab 150 MG Injection',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'RXNORM',
                },
              },
              {
                name: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection code',
                id: '1790099',
                display: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'RXNORM',
                },
              },
              {
                name: '11p partial monosomy syndrome 4135001 code',
                id: '4135001',
                display: '11p partial monosomy syndrome',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Orbital lymphoma 13048006 code',
                id: '13048006',
                display: 'Orbital lymphoma',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Delta heavy chain disease 20224008 code',
                id: '20224008',
                display: 'Delta heavy chain disease',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Malignant neoplasm of breast 254837009 code',
                id: '254837009',
                display: 'Malignant neoplasm of breast',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Primary malignant neoplasm of colon 93761005 code',
                id: '93761005',
                display: 'Primary malignant neoplasm of colon',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Secondary malignant neoplasm of colon 94260004 code',
                id: '94260004',
                display: 'Secondary malignant neoplasm of colon',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Carcinoma in situ of prostate (disorder) 92691004 code',
                id: '92691004',
                display: 'Carcinoma in situ of prostate (disorder)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Small cell carcinoma of lung (disorder) 254632001 code',
                id: '254632001',
                display: 'Small cell carcinoma of lung (disorder)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Non-small cell lung cancer (disorder) 254637007 code',
                id: '254637007',
                display: 'Non-small cell lung cancer (disorder)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
            ],
          },
          concepts: {
            def: [
              {
                name: 'T0 category (finding)',
                display: 'T0 category (finding)',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'T0 category (finding) code',
                  },
                ],
              },
              {
                name: 'T1 category (finding)',
                display: 'T1 category (finding)',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'T1 category (finding) code',
                  },
                ],
              },
              {
                name: 'N0 category (finding)',
                display: 'N0 category (finding)',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'N0 category (finding) code',
                  },
                ],
              },
              {
                name: 'N1 category (finding)',
                display: 'N1 category (finding)',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'N1 category (finding) code',
                  },
                ],
              },
              {
                name: '14 ML pertuzumab 30 MG/ML Injection',
                display: '14 ML pertuzumab 30 MG/ML Injection',
                accessLevel: 'Public',
                code: [
                  {
                    name: '14 ML pertuzumab 30 MG/ML Injection code',
                  },
                ],
              },
              {
                name: 'Cyclophosphamide 1000 MG Injection',
                display: 'Cyclophosphamide 1000 MG Injection',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'Cyclophosphamide 1000 MG Injection code',
                  },
                ],
              },
              {
                name: 'trastuzumab 150 MG Injection',
                display: 'trastuzumab 150 MG Injection',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'trastuzumab 150 MG Injection code',
                  },
                ],
              },
              {
                name: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection',
                display: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection',
                accessLevel: 'Public',
                code: [
                  {
                    name: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection code',
                  },
                ],
              },
              {
                name: 'HER2 [Presence] in Breast cancer specimen by Immune stain',
                display: 'HER2 [Presence] in Breast cancer specimen by Immune stain',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'HER2 [Presence] in Breast cancer specimen by Immune stain code',
                  },
                ],
              },
              {
                name: 'Primary cancers',
                accessLevel: 'Public',
                code: [
                  {
                    name: '11p partial monosomy syndrome 4135001 code',
                  },
                  {
                    name: 'Orbital lymphoma 13048006 code',
                  },
                  {
                    name: 'Delta heavy chain disease 20224008 code',
                  },
                  {
                    name: 'Malignant neoplasm of breast 254837009 code',
                  },
                  {
                    name: 'Primary malignant neoplasm of colon 93761005 code',
                  },
                  {
                    name: 'Secondary malignant neoplasm of colon 94260004 code',
                  },
                  {
                    name: 'Carcinoma in situ of prostate (disorder) 92691004 code',
                  },
                  {
                    name: 'Small cell carcinoma of lung (disorder) 254632001 code',
                  },
                  {
                    name: 'Non-small cell lung cancer (disorder) 254637007 code',
                  },
                ],
              },
            ],
          },
          statements: {
            def: [
              {
                name: 'Patient',
                context: 'Patient',
                expression: {
                  type: 'SingletonFrom',
                  operand: {
                    dataType: '{http://hl7.org/fhir}Patient',
                    type: 'Retrieve',
                  },
                },
              },
              {
                name: 'Primary Cancer Condition',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'Cancer',
                      expression: {
                        dataType: '{http://hl7.org/fhir}Condition',
                        codeProperty: 'code',
                        type: 'Retrieve',
                        codes: {
                          type: 'ToList',
                          operand: {
                            name: 'Primary cancers',
                            type: 'ConceptRef',
                          },
                        },
                      },
                    },
                  ],
                  relationship: [],
                },
              },
              {
                name: 'ToCode',
                context: 'Patient',
                accessLevel: 'Public',
                type: 'FunctionDef',
                expression: {
                  type: 'If',
                  condition: {
                    asType: '{urn:hl7-org:elm-types:r1}Boolean',
                    type: 'As',
                    operand: {
                      type: 'IsNull',
                      operand: {
                        name: 'coding',
                        type: 'OperandRef',
                      },
                    },
                  },
                  then: {
                    asType: '{urn:hl7-org:elm-types:r1}Code',
                    type: 'As',
                    operand: {
                      type: 'Null',
                    },
                  },
                  else: {
                    classType: '{urn:hl7-org:elm-types:r1}Code',
                    type: 'Instance',
                    element: [
                      {
                        name: 'code',
                        value: {
                          path: 'value',
                          type: 'Property',
                          source: {
                            path: 'code',
                            type: 'Property',
                            source: {
                              name: 'coding',
                              type: 'OperandRef',
                            },
                          },
                        },
                      },
                      {
                        name: 'system',
                        value: {
                          path: 'value',
                          type: 'Property',
                          source: {
                            path: 'system',
                            type: 'Property',
                            source: {
                              name: 'coding',
                              type: 'OperandRef',
                            },
                          },
                        },
                      },
                      {
                        name: 'version',
                        value: {
                          path: 'value',
                          type: 'Property',
                          source: {
                            path: 'version',
                            type: 'Property',
                            source: {
                              name: 'coding',
                              type: 'OperandRef',
                            },
                          },
                        },
                      },
                      {
                        name: 'display',
                        value: {
                          path: 'value',
                          type: 'Property',
                          source: {
                            path: 'display',
                            type: 'Property',
                            source: {
                              name: 'coding',
                              type: 'OperandRef',
                            },
                          },
                        },
                      },
                    ],
                  },
                },
                operand: [
                  {
                    name: 'coding',
                    operandTypeSpecifier: {
                      name: '{http://hl7.org/fhir}Coding',
                      type: 'NamedTypeSpecifier',
                    },
                  },
                ],
              },
              {
                name: 'ToConcept',
                context: 'Patient',
                accessLevel: 'Public',
                type: 'FunctionDef',
                expression: {
                  type: 'If',
                  condition: {
                    asType: '{urn:hl7-org:elm-types:r1}Boolean',
                    type: 'As',
                    operand: {
                      type: 'IsNull',
                      operand: {
                        name: 'concept',
                        type: 'OperandRef',
                      },
                    },
                  },
                  then: {
                    asType: '{urn:hl7-org:elm-types:r1}Concept',
                    type: 'As',
                    operand: {
                      type: 'Null',
                    },
                  },
                  else: {
                    classType: '{urn:hl7-org:elm-types:r1}Concept',
                    type: 'Instance',
                    element: [
                      {
                        name: 'codes',
                        value: {
                          type: 'Query',
                          source: [
                            {
                              alias: 'C',
                              expression: {
                                path: 'coding',
                                type: 'Property',
                                source: {
                                  name: 'concept',
                                  type: 'OperandRef',
                                },
                              },
                            },
                          ],
                          relationship: [],
                          return: {
                            expression: {
                              name: 'ToCode',
                              type: 'FunctionRef',
                              operand: [
                                {
                                  name: 'C',
                                  type: 'AliasRef',
                                },
                              ],
                            },
                          },
                        },
                      },
                      {
                        name: 'display',
                        value: {
                          path: 'value',
                          type: 'Property',
                          source: {
                            path: 'text',
                            type: 'Property',
                            source: {
                              name: 'concept',
                              type: 'OperandRef',
                            },
                          },
                        },
                      },
                    ],
                  },
                },
                operand: [
                  {
                    name: 'concept',
                    operandTypeSpecifier: {
                      name: '{http://hl7.org/fhir}CodeableConcept',
                      type: 'NamedTypeSpecifier',
                    },
                  },
                ],
              },
              {
                name: 'T > 2',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'TLarge',
                      expression: {
                        dataType: '{http://hl7.org/fhir}Observation',
                        codeProperty: 'code',
                        type: 'Retrieve',
                        codes: {
                          type: 'ToList',
                          operand: {
                            name: 'Primary tumor.clinical [Class] Cancer code',
                            type: 'CodeRef',
                          },
                        },
                      },
                    },
                  ],
                  let: [
                    {
                      identifier: 'TLageConcept',
                      expression: {
                        name: 'ToConcept',
                        type: 'FunctionRef',
                        operand: [
                          {
                            strict: false,
                            type: 'As',
                            operand: {
                              path: 'value',
                              scope: 'TLarge',
                              type: 'Property',
                            },
                            asTypeSpecifier: {
                              name: '{http://hl7.org/fhir}CodeableConcept',
                              type: 'NamedTypeSpecifier',
                            },
                          },
                        ],
                      },
                    },
                  ],
                  relationship: [],
                  where: {
                    type: 'Null',
                  },
                  return: {
                    expression: {
                      type: 'Tuple',
                      element: [
                        {
                          name: 'resourceType',
                          value: {
                            valueType: '{urn:hl7-org:elm-types:r1}String',
                            value: 'Observation',
                            type: 'Literal',
                          },
                        },
                        {
                          name: 'id',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'id',
                              scope: 'TLarge',
                              type: 'Property',
                            },
                          },
                        },
                        {
                          name: 'status',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'status',
                              scope: 'TLarge',
                              type: 'Property',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
              {
                name: 'T <= 2',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'TSmall',
                      expression: {
                        dataType: '{http://hl7.org/fhir}Observation',
                        codeProperty: 'code',
                        type: 'Retrieve',
                        codes: {
                          type: 'ToList',
                          operand: {
                            name: 'Primary tumor.clinical [Class] Cancer code',
                            type: 'CodeRef',
                          },
                        },
                      },
                    },
                  ],
                  relationship: [],
                  where: {
                    type: 'Null',
                  },
                  return: {
                    expression: {
                      type: 'Tuple',
                      element: [
                        {
                          name: 'resourceType',
                          value: {
                            valueType: '{urn:hl7-org:elm-types:r1}String',
                            value: 'Observation',
                            type: 'Literal',
                          },
                        },
                        {
                          name: 'id',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'id',
                              scope: 'TSmall',
                              type: 'Property',
                            },
                          },
                        },
                        {
                          name: 'status',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'status',
                              scope: 'TSmall',
                              type: 'Property',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
              {
                name: 'N+',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'NLarge',
                      expression: {
                        dataType: '{http://hl7.org/fhir}Observation',
                        codeProperty: 'code',
                        type: 'Retrieve',
                        codes: {
                          type: 'ToList',
                          operand: {
                            name: 'Regional lymph nodes.clinical [Class] Cancer code',
                            type: 'CodeRef',
                          },
                        },
                      },
                    },
                  ],
                  let: [
                    {
                      identifier: 'NLargeConcept',
                      expression: {
                        name: 'ToConcept',
                        type: 'FunctionRef',
                        operand: [
                          {
                            strict: false,
                            type: 'As',
                            operand: {
                              path: 'value',
                              scope: 'NLarge',
                              type: 'Property',
                            },
                            asTypeSpecifier: {
                              name: '{http://hl7.org/fhir}CodeableConcept',
                              type: 'NamedTypeSpecifier',
                            },
                          },
                        ],
                      },
                    },
                  ],
                  relationship: [],
                  where: {
                    type: 'Null',
                  },
                  return: {
                    expression: {
                      type: 'Tuple',
                      element: [
                        {
                          name: 'resourceType',
                          value: {
                            valueType: '{urn:hl7-org:elm-types:r1}String',
                            value: 'Observation',
                            type: 'Literal',
                          },
                        },
                        {
                          name: 'id',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'id',
                              scope: 'NLarge',
                              type: 'Property',
                            },
                          },
                        },
                        {
                          name: 'status',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'status',
                              scope: 'NLarge',
                              type: 'Property',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
              {
                name: 'N0',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'N0',
                      expression: {
                        dataType: '{http://hl7.org/fhir}Observation',
                        codeProperty: 'code',
                        type: 'Retrieve',
                        codes: {
                          type: 'ToList',
                          operand: {
                            name: 'Regional lymph nodes.clinical [Class] Cancer code',
                            type: 'CodeRef',
                          },
                        },
                      },
                    },
                  ],
                  relationship: [],
                  where: {
                    type: 'Equivalent',
                    operand: [
                      {
                        name: 'ToConcept',
                        type: 'FunctionRef',
                        operand: [
                          {
                            strict: false,
                            type: 'As',
                            operand: {
                              path: 'value',
                              scope: 'N0',
                              type: 'Property',
                            },
                            asTypeSpecifier: {
                              name: '{http://hl7.org/fhir}CodeableConcept',
                              type: 'NamedTypeSpecifier',
                            },
                          },
                        ],
                      },
                      {
                        name: 'N0 category (finding)',
                        type: 'ConceptRef',
                      },
                    ],
                  },
                  return: {
                    expression: {
                      type: 'Tuple',
                      element: [
                        {
                          name: 'resourceType',
                          value: {
                            valueType: '{urn:hl7-org:elm-types:r1}String',
                            value: 'Observation',
                            type: 'Literal',
                          },
                        },
                        {
                          name: 'id',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'id',
                              scope: 'N0',
                              type: 'Property',
                            },
                          },
                        },
                        {
                          name: 'status',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'status',
                              scope: 'N0',
                              type: 'Property',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
              {
                name: 'Surgery1',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'If',
                  condition: {
                    asType: '{urn:hl7-org:elm-types:r1}Boolean',
                    type: 'As',
                    operand: {
                      type: 'Exists',
                      operand: {
                        dataType: '{http://hl7.org/fhir}Procedure',
                        codeProperty: 'code',
                        type: 'Retrieve',
                        codes: {
                          type: 'ToList',
                          operand: {
                            name: 'Lumpectomy of breast (procedure) code',
                            type: 'CodeRef',
                          },
                        },
                      },
                    },
                  },
                  then: {
                    type: 'Query',
                    source: [
                      {
                        alias: 'Lumpectomy',
                        expression: {
                          dataType: '{http://hl7.org/fhir}Procedure',
                          codeProperty: 'code',
                          type: 'Retrieve',
                          codes: {
                            type: 'ToList',
                            operand: {
                              name: 'Lumpectomy of breast (procedure) code',
                              type: 'CodeRef',
                            },
                          },
                        },
                      },
                    ],
                    relationship: [],
                    return: {
                      expression: {
                        type: 'Tuple',
                        element: [
                          {
                            name: 'resourceType',
                            value: {
                              valueType: '{urn:hl7-org:elm-types:r1}String',
                              value: 'Procedure',
                              type: 'Literal',
                            },
                          },
                          {
                            name: 'id',
                            value: {
                              path: 'value',
                              type: 'Property',
                              source: {
                                path: 'id',
                                scope: 'Lumpectomy',
                                type: 'Property',
                              },
                            },
                          },
                          {
                            name: 'status',
                            value: {
                              path: 'value',
                              type: 'Property',
                              source: {
                                path: 'status',
                                scope: 'Lumpectomy',
                                type: 'Property',
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                  else: {
                    type: 'Query',
                    source: [
                      {
                        alias: 'Request',
                        expression: {
                          dataType: '{http://hl7.org/fhir}ServiceRequest',
                          codeProperty: 'code',
                          type: 'Retrieve',
                          codes: {
                            type: 'ToList',
                            operand: {
                              name: 'Lumpectomy of breast (procedure) code',
                              type: 'CodeRef',
                            },
                          },
                        },
                      },
                    ],
                    relationship: [],
                    return: {
                      expression: {
                        type: 'Tuple',
                        element: [
                          {
                            name: 'resourceType',
                            value: {
                              valueType: '{urn:hl7-org:elm-types:r1}String',
                              value: 'ServiceRequest',
                              type: 'Literal',
                            },
                          },
                          {
                            name: 'id',
                            value: {
                              path: 'value',
                              type: 'Property',
                              source: {
                                path: 'id',
                                scope: 'Request',
                                type: 'Property',
                              },
                            },
                          },
                          {
                            name: 'status',
                            value: {
                              path: 'value',
                              type: 'Property',
                              source: {
                                path: 'status',
                                scope: 'Request',
                                type: 'Property',
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
              {
                name: 'PaclitaxelTrastuzumab',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'MR',
                      expression: {
                        type: 'Null',
                      },
                    },
                  ],
                  relationship: [],
                  return: {
                    expression: {
                      type: 'Null',
                    },
                  },
                },
              },
              {
                name: 'ChemotherapyTCHP',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'MR',
                      expression: {
                        dataType: '{http://hl7.org/fhir}MedicationRequest',
                        codeProperty: 'medication',
                        type: 'Retrieve',
                        codes: {
                          type: 'ToList',
                          operand: {
                            name: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection code',
                            type: 'CodeRef',
                          },
                        },
                      },
                    },
                  ],
                  relationship: [],
                  where: {
                    type: 'Equivalent',
                    operand: [
                      {
                        name: 'ToConcept',
                        type: 'FunctionRef',
                        operand: [
                          {
                            strict: false,
                            type: 'As',
                            operand: {
                              path: 'medication',
                              scope: 'MR',
                              type: 'Property',
                            },
                            asTypeSpecifier: {
                              name: '{http://hl7.org/fhir}CodeableConcept',
                              type: 'NamedTypeSpecifier',
                            },
                          },
                        ],
                      },
                      {
                        name: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection',
                        type: 'ConceptRef',
                      },
                    ],
                  },
                  return: {
                    expression: {
                      type: 'Tuple',
                      element: [
                        {
                          name: 'resourceType',
                          value: {
                            valueType: '{urn:hl7-org:elm-types:r1}String',
                            value: 'MedicationRequest',
                            type: 'Literal',
                          },
                        },
                        {
                          name: 'id',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'id',
                              scope: 'MR',
                              type: 'Property',
                            },
                          },
                        },
                        {
                          name: 'status',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'status',
                              scope: 'MR',
                              type: 'Property',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
              {
                name: 'ChemotherapyACTHP',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'MR',
                      expression: {
                        dataType: '{http://hl7.org/fhir}MedicationRequest',
                        codeProperty: 'medication',
                        type: 'Retrieve',
                        codes: {
                          type: 'ToList',
                          operand: {
                            name: 'Cyclophosphamide 1000 MG Injection code',
                            type: 'CodeRef',
                          },
                        },
                      },
                    },
                  ],
                  relationship: [],
                  where: {
                    type: 'Equivalent',
                    operand: [
                      {
                        name: 'ToConcept',
                        type: 'FunctionRef',
                        operand: [
                          {
                            strict: false,
                            type: 'As',
                            operand: {
                              path: 'medication',
                              scope: 'MR',
                              type: 'Property',
                            },
                            asTypeSpecifier: {
                              name: '{http://hl7.org/fhir}CodeableConcept',
                              type: 'NamedTypeSpecifier',
                            },
                          },
                        ],
                      },
                      {
                        name: 'Cyclophosphamide 1000 MG Injection',
                        type: 'ConceptRef',
                      },
                    ],
                  },
                  return: {
                    expression: {
                      type: 'Tuple',
                      element: [
                        {
                          name: 'resourceType',
                          value: {
                            valueType: '{urn:hl7-org:elm-types:r1}String',
                            value: 'MedicationRequest',
                            type: 'Literal',
                          },
                        },
                        {
                          name: 'id',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'id',
                              scope: 'MR',
                              type: 'Property',
                            },
                          },
                        },
                        {
                          name: 'status',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'status',
                              scope: 'MR',
                              type: 'Property',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
              {
                name: 'ChemotherapyddACTHP',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'MR',
                      expression: {
                        dataType: '{http://hl7.org/fhir}MedicationRequest',
                        codeProperty: 'medication',
                        type: 'Retrieve',
                        codes: {
                          type: 'ToList',
                          operand: {
                            name: '14 ML pertuzumab 30 MG/ML Injection code',
                            type: 'CodeRef',
                          },
                        },
                      },
                    },
                  ],
                  relationship: [],
                  where: {
                    type: 'Equivalent',
                    operand: [
                      {
                        name: 'ToConcept',
                        type: 'FunctionRef',
                        operand: [
                          {
                            strict: false,
                            type: 'As',
                            operand: {
                              path: 'medication',
                              scope: 'MR',
                              type: 'Property',
                            },
                            asTypeSpecifier: {
                              name: '{http://hl7.org/fhir}CodeableConcept',
                              type: 'NamedTypeSpecifier',
                            },
                          },
                        ],
                      },
                      {
                        name: '14 ML pertuzumab 30 MG/ML Injection',
                        type: 'ConceptRef',
                      },
                    ],
                  },
                  return: {
                    expression: {
                      type: 'Tuple',
                      element: [
                        {
                          name: 'resourceType',
                          value: {
                            valueType: '{urn:hl7-org:elm-types:r1}String',
                            value: 'MedicationRequest',
                            type: 'Literal',
                          },
                        },
                        {
                          name: 'id',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'id',
                              scope: 'MR',
                              type: 'Property',
                            },
                          },
                        },
                        {
                          name: 'status',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'status',
                              scope: 'MR',
                              type: 'Property',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
              {
                name: 'Surgery2',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'If',
                  condition: {
                    asType: '{urn:hl7-org:elm-types:r1}Boolean',
                    type: 'As',
                    operand: {
                      type: 'Exists',
                      operand: {
                        dataType: '{http://hl7.org/fhir}Procedure',
                        codeProperty: 'code',
                        type: 'Retrieve',
                        codes: {
                          type: 'ToList',
                          operand: {
                            name: 'Lumpectomy of breast (procedure) code',
                            type: 'CodeRef',
                          },
                        },
                      },
                    },
                  },
                  then: {
                    type: 'Query',
                    source: [
                      {
                        alias: 'Lumpectomy',
                        expression: {
                          dataType: '{http://hl7.org/fhir}Procedure',
                          codeProperty: 'code',
                          type: 'Retrieve',
                          codes: {
                            type: 'ToList',
                            operand: {
                              name: 'Lumpectomy of breast (procedure) code',
                              type: 'CodeRef',
                            },
                          },
                        },
                      },
                    ],
                    relationship: [],
                    return: {
                      expression: {
                        type: 'Tuple',
                        element: [
                          {
                            name: 'resourceType',
                            value: {
                              valueType: '{urn:hl7-org:elm-types:r1}String',
                              value: 'Procedure',
                              type: 'Literal',
                            },
                          },
                          {
                            name: 'id',
                            value: {
                              path: 'value',
                              type: 'Property',
                              source: {
                                path: 'id',
                                scope: 'Lumpectomy',
                                type: 'Property',
                              },
                            },
                          },
                          {
                            name: 'status',
                            value: {
                              path: 'value',
                              type: 'Property',
                              source: {
                                path: 'status',
                                scope: 'Lumpectomy',
                                type: 'Property',
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                  else: {
                    type: 'Query',
                    source: [
                      {
                        alias: 'Request',
                        expression: {
                          dataType: '{http://hl7.org/fhir}ServiceRequest',
                          codeProperty: 'code',
                          type: 'Retrieve',
                          codes: {
                            type: 'ToList',
                            operand: {
                              name: 'Lumpectomy of breast (procedure) code',
                              type: 'CodeRef',
                            },
                          },
                        },
                      },
                    ],
                    relationship: [],
                    return: {
                      expression: {
                        type: 'Tuple',
                        element: [
                          {
                            name: 'resourceType',
                            value: {
                              valueType: '{urn:hl7-org:elm-types:r1}String',
                              value: 'ServiceRequest',
                              type: 'Literal',
                            },
                          },
                          {
                            name: 'id',
                            value: {
                              path: 'value',
                              type: 'Property',
                              source: {
                                path: 'id',
                                scope: 'Request',
                                type: 'Property',
                              },
                            },
                          },
                          {
                            name: 'status',
                            value: {
                              path: 'value',
                              type: 'Property',
                              source: {
                                path: 'status',
                                scope: 'Request',
                                type: 'Property',
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
              {
                name: 'Complete',
                context: 'Patient',
                accessLevel: 'Public',
              },
              {
                name: 'Partial/Stable/Progressive',
                context: 'Patient',
                accessLevel: 'Public',
              },
              {
                name: 'AdotrastuzumabEmtansine',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'MR',
                      expression: {
                        type: 'Null',
                      },
                    },
                  ],
                  relationship: [],
                  return: {
                    expression: {
                      type: 'Null',
                    },
                  },
                },
              },
              {
                name: 'Trastuzumab',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'MR',
                      expression: {
                        type: 'Null',
                      },
                    },
                  ],
                  relationship: [],
                  return: {
                    expression: {
                      type: 'Null',
                    },
                  },
                },
              },
              {
                name: 'PertuzumabTrastuzumab',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'MR',
                      expression: {
                        type: 'Null',
                      },
                    },
                  ],
                  relationship: [],
                  return: {
                    expression: {
                      type: 'Null',
                    },
                  },
                },
              },
            ],
          },
        },
      },
      preconditions: {
        library: {
          identifier: {
            id: 'mCODEResources',
            version: '1',
          },
          schemaIdentifier: {
            id: 'urn:hl7-org:elm',
            version: 'r1',
          },
          usings: {
            def: [
              {
                localIdentifier: 'System',
                uri: 'urn:hl7-org:elm-types:r1',
              },
              {
                localIdentifier: 'FHIR',
                uri: 'http://hl7.org/fhir',
                version: '4.0.0',
              },
            ],
          },
          codeSystems: {
            def: [
              {
                name: 'SNOMEDCT',
                id: 'http://snomed.info/sct',
                accessLevel: 'Public',
              },
              {
                name: 'LOINC',
                id: 'http://loinc.org',
                accessLevel: 'Public',
              },
              {
                name: 'RXNORM',
                id: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                accessLevel: 'Public',
              },
            ],
          },
          codes: {
            def: [
              {
                name: 'Primary tumor.clinical [Class] Cancer code',
                id: '21905-5',
                display: 'Primary tumor.clinical [Class] Cancer',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'LOINC',
                },
              },
              {
                name: 'Regional lymph nodes.clinical [Class] Cancer code',
                id: '21906-3',
                display: 'Regional lymph nodes.clinical [Class] Cancer',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'LOINC',
                },
              },
              {
                name: 'HER2 [Presence] in Breast cancer specimen by Immune stain code',
                id: '85319-2',
                display: 'HER2 [Presence] in Breast cancer specimen by Immune stain',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'LOINC',
                },
              },
              {
                name: 'T0 category (finding) code',
                id: '58790005',
                display: 'T0 category (finding)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'T1 category (finding) code',
                id: '23351008',
                display: 'T1 category (finding)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'N0 category (finding) code',
                id: '62455006',
                display: 'N0 category (finding)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'N1 category (finding) code',
                id: '53623008',
                display: 'N1 category (finding)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Lumpectomy of breast (procedure) code',
                id: '392021009',
                display: 'Lumpectomy of breast (procedure)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Teleradiotherapy procedure (procedure) code',
                id: '33195004',
                display: 'Teleradiotherapy procedure (procedure)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Chemotherapy (procedure) code',
                id: '367336001',
                display: 'Chemotherapy (procedure)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: '14 ML pertuzumab 30 MG/ML Injection code',
                id: '1298948',
                display: '14 ML pertuzumab 30 MG/ML Injection',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'RXNORM',
                },
              },
              {
                name: 'Cyclophosphamide 1000 MG Injection code',
                id: '1734919',
                display: 'Cyclophosphamide 1000 MG Injection',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'RXNORM',
                },
              },
              {
                name: 'trastuzumab 150 MG Injection code',
                id: '1922509',
                display: 'trastuzumab 150 MG Injection',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'RXNORM',
                },
              },
              {
                name: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection code',
                id: '1790099',
                display: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'RXNORM',
                },
              },
              {
                name: '11p partial monosomy syndrome 4135001 code',
                id: '4135001',
                display: '11p partial monosomy syndrome',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Orbital lymphoma 13048006 code',
                id: '13048006',
                display: 'Orbital lymphoma',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Delta heavy chain disease 20224008 code',
                id: '20224008',
                display: 'Delta heavy chain disease',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Malignant neoplasm of breast 254837009 code',
                id: '254837009',
                display: 'Malignant neoplasm of breast',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Primary malignant neoplasm of colon 93761005 code',
                id: '93761005',
                display: 'Primary malignant neoplasm of colon',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Secondary malignant neoplasm of colon 94260004 code',
                id: '94260004',
                display: 'Secondary malignant neoplasm of colon',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Carcinoma in situ of prostate (disorder) 92691004 code',
                id: '92691004',
                display: 'Carcinoma in situ of prostate (disorder)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Small cell carcinoma of lung (disorder) 254632001 code',
                id: '254632001',
                display: 'Small cell carcinoma of lung (disorder)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
              {
                name: 'Non-small cell lung cancer (disorder) 254637007 code',
                id: '254637007',
                display: 'Non-small cell lung cancer (disorder)',
                accessLevel: 'Public',
                codeSystem: {
                  name: 'SNOMEDCT',
                },
              },
            ],
          },
          concepts: {
            def: [
              {
                name: 'T0 category (finding)',
                display: 'T0 category (finding)',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'T0 category (finding) code',
                  },
                ],
              },
              {
                name: 'T1 category (finding)',
                display: 'T1 category (finding)',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'T1 category (finding) code',
                  },
                ],
              },
              {
                name: 'N0 category (finding)',
                display: 'N0 category (finding)',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'N0 category (finding) code',
                  },
                ],
              },
              {
                name: 'N1 category (finding)',
                display: 'N1 category (finding)',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'N1 category (finding) code',
                  },
                ],
              },
              {
                name: '14 ML pertuzumab 30 MG/ML Injection',
                display: '14 ML pertuzumab 30 MG/ML Injection',
                accessLevel: 'Public',
                code: [
                  {
                    name: '14 ML pertuzumab 30 MG/ML Injection code',
                  },
                ],
              },
              {
                name: 'Cyclophosphamide 1000 MG Injection',
                display: 'Cyclophosphamide 1000 MG Injection',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'Cyclophosphamide 1000 MG Injection code',
                  },
                ],
              },
              {
                name: 'trastuzumab 150 MG Injection',
                display: 'trastuzumab 150 MG Injection',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'trastuzumab 150 MG Injection code',
                  },
                ],
              },
              {
                name: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection',
                display: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection',
                accessLevel: 'Public',
                code: [
                  {
                    name: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection code',
                  },
                ],
              },
              {
                name: 'HER2 [Presence] in Breast cancer specimen by Immune stain',
                display: 'HER2 [Presence] in Breast cancer specimen by Immune stain',
                accessLevel: 'Public',
                code: [
                  {
                    name: 'HER2 [Presence] in Breast cancer specimen by Immune stain code',
                  },
                ],
              },
              {
                name: 'Primary cancers',
                accessLevel: 'Public',
                code: [
                  {
                    name: '11p partial monosomy syndrome 4135001 code',
                  },
                  {
                    name: 'Orbital lymphoma 13048006 code',
                  },
                  {
                    name: 'Delta heavy chain disease 20224008 code',
                  },
                  {
                    name: 'Malignant neoplasm of breast 254837009 code',
                  },
                  {
                    name: 'Primary malignant neoplasm of colon 93761005 code',
                  },
                  {
                    name: 'Secondary malignant neoplasm of colon 94260004 code',
                  },
                  {
                    name: 'Carcinoma in situ of prostate (disorder) 92691004 code',
                  },
                  {
                    name: 'Small cell carcinoma of lung (disorder) 254632001 code',
                  },
                  {
                    name: 'Non-small cell lung cancer (disorder) 254637007 code',
                  },
                ],
              },
            ],
          },
          statements: {
            def: [
              {
                name: 'Patient',
                context: 'Patient',
                expression: {
                  type: 'SingletonFrom',
                  operand: {
                    dataType: '{http://hl7.org/fhir}Patient',
                    type: 'Retrieve',
                  },
                },
              },
              {
                name: 'Primary Cancer Condition',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'Cancer',
                      expression: {
                        dataType: '{http://hl7.org/fhir}Condition',
                        codeProperty: 'code',
                        type: 'Retrieve',
                        codes: {
                          type: 'ToList',
                          operand: {
                            name: 'Primary cancers',
                            type: 'ConceptRef',
                          },
                        },
                      },
                    },
                  ],
                  relationship: [],
                },
              },
              {
                name: 'ToCode',
                context: 'Patient',
                accessLevel: 'Public',
                type: 'FunctionDef',
                expression: {
                  type: 'If',
                  condition: {
                    asType: '{urn:hl7-org:elm-types:r1}Boolean',
                    type: 'As',
                    operand: {
                      type: 'IsNull',
                      operand: {
                        name: 'coding',
                        type: 'OperandRef',
                      },
                    },
                  },
                  then: {
                    asType: '{urn:hl7-org:elm-types:r1}Code',
                    type: 'As',
                    operand: {
                      type: 'Null',
                    },
                  },
                  else: {
                    classType: '{urn:hl7-org:elm-types:r1}Code',
                    type: 'Instance',
                    element: [
                      {
                        name: 'code',
                        value: {
                          path: 'value',
                          type: 'Property',
                          source: {
                            path: 'code',
                            type: 'Property',
                            source: {
                              name: 'coding',
                              type: 'OperandRef',
                            },
                          },
                        },
                      },
                      {
                        name: 'system',
                        value: {
                          path: 'value',
                          type: 'Property',
                          source: {
                            path: 'system',
                            type: 'Property',
                            source: {
                              name: 'coding',
                              type: 'OperandRef',
                            },
                          },
                        },
                      },
                      {
                        name: 'version',
                        value: {
                          path: 'value',
                          type: 'Property',
                          source: {
                            path: 'version',
                            type: 'Property',
                            source: {
                              name: 'coding',
                              type: 'OperandRef',
                            },
                          },
                        },
                      },
                      {
                        name: 'display',
                        value: {
                          path: 'value',
                          type: 'Property',
                          source: {
                            path: 'display',
                            type: 'Property',
                            source: {
                              name: 'coding',
                              type: 'OperandRef',
                            },
                          },
                        },
                      },
                    ],
                  },
                },
                operand: [
                  {
                    name: 'coding',
                    operandTypeSpecifier: {
                      name: '{http://hl7.org/fhir}Coding',
                      type: 'NamedTypeSpecifier',
                    },
                  },
                ],
              },
              {
                name: 'ToConcept',
                context: 'Patient',
                accessLevel: 'Public',
                type: 'FunctionDef',
                expression: {
                  type: 'If',
                  condition: {
                    asType: '{urn:hl7-org:elm-types:r1}Boolean',
                    type: 'As',
                    operand: {
                      type: 'IsNull',
                      operand: {
                        name: 'concept',
                        type: 'OperandRef',
                      },
                    },
                  },
                  then: {
                    asType: '{urn:hl7-org:elm-types:r1}Concept',
                    type: 'As',
                    operand: {
                      type: 'Null',
                    },
                  },
                  else: {
                    classType: '{urn:hl7-org:elm-types:r1}Concept',
                    type: 'Instance',
                    element: [
                      {
                        name: 'codes',
                        value: {
                          type: 'Query',
                          source: [
                            {
                              alias: 'C',
                              expression: {
                                path: 'coding',
                                type: 'Property',
                                source: {
                                  name: 'concept',
                                  type: 'OperandRef',
                                },
                              },
                            },
                          ],
                          relationship: [],
                          return: {
                            expression: {
                              name: 'ToCode',
                              type: 'FunctionRef',
                              operand: [
                                {
                                  name: 'C',
                                  type: 'AliasRef',
                                },
                              ],
                            },
                          },
                        },
                      },
                      {
                        name: 'display',
                        value: {
                          path: 'value',
                          type: 'Property',
                          source: {
                            path: 'text',
                            type: 'Property',
                            source: {
                              name: 'concept',
                              type: 'OperandRef',
                            },
                          },
                        },
                      },
                    ],
                  },
                },
                operand: [
                  {
                    name: 'concept',
                    operandTypeSpecifier: {
                      name: '{http://hl7.org/fhir}CodeableConcept',
                      type: 'NamedTypeSpecifier',
                    },
                  },
                ],
              },
              {
                name: 'Condition',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'PrimaryCancer',
                      expression: {
                        name: 'Primary Cancer Condition',
                        type: 'ExpressionRef',
                      },
                    },
                  ],
                  relationship: [],
                  return: {
                    expression: {
                      type: 'Tuple',
                      element: [
                        {
                          name: 'value',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'text',
                              type: 'Property',
                              source: {
                                path: 'code',
                                scope: 'PrimaryCancer',
                                type: 'Property',
                              },
                            },
                          },
                        },
                        {
                          name: 'match',
                          value: {
                            type: 'Equivalent',
                            operand: [
                              {
                                path: 'value',
                                type: 'Property',
                                source: {
                                  path: 'text',
                                  type: 'Property',
                                  source: {
                                    path: 'code',
                                    scope: 'PrimaryCancer',
                                    type: 'Property',
                                  },
                                },
                              },
                              {
                                valueType: '{urn:hl7-org:elm-types:r1}String',
                                value: 'Malignant neoplasm of breast (disorder)',
                                type: 'Literal',
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
              },
              {
                name: 'HER2 Status',
                context: 'Patient',
                accessLevel: 'Public',
                expression: {
                  type: 'Query',
                  source: [
                    {
                      alias: 'Her2',
                      expression: {
                        dataType: '{http://hl7.org/fhir}Observation',
                        codeProperty: 'code',
                        type: 'Retrieve',
                        codes: {
                          type: 'ToList',
                          operand: {
                            name: 'HER2 [Presence] in Breast cancer specimen by Immune stain',
                            type: 'ConceptRef',
                          },
                        },
                      },
                    },
                  ],
                  relationship: [],
                  return: {
                    expression: {
                      type: 'Tuple',
                      element: [
                        {
                          name: 'value',
                          value: {
                            path: 'value',
                            type: 'Property',
                            source: {
                              path: 'text',
                              type: 'Property',
                              source: {
                                path: 'value',
                                scope: 'Her2',
                                type: 'Property',
                              },
                            },
                          },
                        },
                        {
                          name: 'match',
                          value: {
                            type: 'Equivalent',
                            operand: [
                              {
                                path: 'value',
                                type: 'Property',
                                source: {
                                  path: 'text',
                                  type: 'Property',
                                  source: {
                                    path: 'value',
                                    scope: 'Her2',
                                    type: 'Property',
                                  },
                                },
                              },
                              {
                                valueType: '{urn:hl7-org:elm-types:r1}String',
                                value: 'Positive',
                                type: 'Literal',
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    name: 'test_breast_cancer',
    id: 'test_breast_cancer',
    description: 'Mock breast cancer pathway used for testing the system',
    library: ['mCODE_Library.cql'],
    preconditions: [
      {
        id: '1',
        elementName: 'Condition',
        expected: 'Breast Cancer',
        cql:
          '"Primary Cancer Condition" PrimaryCancer return Tuple{ value: PrimaryCancer.code.text.value, match: PrimaryCancer.code.text.value ~ \'Malignant neoplasm of breast (disorder)\' } ',
      },
    ],
    nodes: {
      Start: {
        key: 'Start',
        label: 'Start',
        type: 'start',
        transitions: [
          {
            id: '1',
            transition: 'T-test',
          },
        ],
      },
      'T-test': {
        key: 'T-test',
        label: 'T-test',
        type: 'branch',
        transitions: [
          {
            id: '1',
            transition: 'N-test',
            condition: {
              description: 'T = T0',
              cql:
                '[Observation: "Primary tumor.clinical [Class] Cancer code"] T0 where ToConcept(T0.value as FHIR.CodeableConcept) ~ "T0 category (finding)"return Tuple{ resourceType: \'Observation\', id: T0.id.value, status: T0.status.value }',
              elm: {
                library: {
                  identifier: {
                    id: '1',
                    version: '1.0',
                  },
                  schemaIdentifier: {
                    id: '1',
                    version: '1.0',
                  },
                  usings: {
                    def: [
                      {
                        localIdentifier: 'example',
                        uri: 'urn:example-org',
                      },
                    ],
                  },
                  includes: {
                    def: [
                      {
                        path: 'example-path',
                        version: '1.0',
                      },
                    ],
                  },
                  valueSets: {
                    def: [
                      {
                        name: 'example',
                        id: '1',
                        accessLevel: 'Public',
                        resultTypeSpecifier: {},
                      },
                    ],
                  },
                  codeSystems: {
                    def: [],
                  },
                  codes: {
                    def: [],
                  },
                  statements: {
                    def: [
                      {
                        name: 'Tumor Size',
                        context: 'Patient',
                        expression: {},
                      },
                    ],
                  },
                },
              },
            },
          },
          {
            id: '2',
            transition: 'Surgery',
            condition: {
              description: 'T = T1',
              cql:
                '[Observation: "Primary tumor.clinical [Class] Cancer code"] T1 where ToConcept(T1.value as FHIR.CodeableConcept) ~ "T1 category (finding)"return Tuple{ resourceType: \'Observation\', id: T1.id.value, status: T1.status.value }',
              elm: {
                library: {
                  identifier: {
                    id: '1',
                    version: '1.0',
                  },
                  schemaIdentifier: {
                    id: '1',
                    version: '1.0',
                  },
                  usings: {
                    def: [
                      {
                        localIdentifier: 'example',
                        uri: 'urn:example-org',
                      },
                      {
                        localIdentifier: 'example2',
                        uri: 'urn:example2-org',
                      },
                    ],
                  },
                  includes: {
                    def: [
                      {
                        path: 'example-path',
                        version: '1.0',
                      },
                      {
                        path: 'example-path-2',
                        version: '1.0',
                      },
                    ],
                  },
                  valueSets: {
                    def: [
                      {
                        name: 'example2',
                        id: '2',
                        accessLevel: 'Public',
                        resultTypeSpecifier: {},
                      },
                    ],
                  },
                  codeSystems: {
                    def: [],
                  },
                  codes: {
                    def: [],
                  },
                  statements: {
                    def: [
                      {
                        name: 'Tumor Size',
                        context: 'Patient',
                        expression: {},
                      },
                    ],
                  },
                },
              },
            },
          },
        ],
      },
      'N-test': {
        key: 'N-test',
        label: 'N-test',
        type: 'branch',
        transitions: [
          {
            id: '1',
            transition: 'Radiation',
          },
          {
            id: '2',
            transition: 'OtherRadiation',
            condition: {
              description: 'N = N0',
              cql:
                '[Observation: "Regional lymph nodes.clinical [Class] Cancer code"] N0 where ToConcept(N0.value as FHIR.CodeableConcept) ~ "N0 category (finding)"return Tuple{ resourceType: \'Observation\', id: N0.id.value, status: N0.status.value }',
              elm: {
                library: {
                  identifier: {
                    id: '1',
                    version: '1.0',
                  },
                  schemaIdentifier: {
                    id: '1',
                    version: '1.0',
                  },
                  usings: {
                    def: [
                      {
                        localIdentifier: 'System',
                        uri: 'urn:hl7-org:elm-types:r1',
                      },
                    ],
                  },
                  includes: {
                    def: [
                      {
                        path: 'example-path-3',
                        version: '1.0',
                      },
                    ],
                  },
                  valueSets: {
                    def: [],
                  },
                  codeSystems: {
                    def: [],
                  },
                  codes: {
                    def: [],
                  },
                  statements: {
                    def: [
                      {
                        name: 'Tumor Size',
                        context: 'Patient',
                        expression: {},
                      },
                    ],
                  },
                },
              },
            },
          },
          {
            id: '3',
            transition: 'ChemoMedication',
            condition: {
              description: 'N = N1',
              cql:
                '[Observation: "Regional lymph nodes.clinical [Class] Cancer code"] N1 where ToConcept(N1.value as FHIR.CodeableConcept) ~ "N1 category (finding)"return Tuple{ resourceType: \'Observation\', id: N1.id.value, status: N1.status.value }',
              elm: {
                library: {
                  identifier: {
                    id: '1',
                    version: '1.0',
                  },
                  schemaIdentifier: {
                    id: '1',
                    version: '1.0',
                  },
                  usings: {
                    def: [],
                  },
                  includes: {
                    def: [],
                  },
                  valueSets: {
                    def: [],
                  },
                  codeSystems: {
                    def: [],
                  },
                  codes: {
                    def: [],
                  },
                  statements: {
                    def: [
                      {
                        name: 'Tumor Size',
                        context: 'Patient',
                        expression: {},
                      },
                    ],
                  },
                },
              },
            },
          },
        ],
      },
      Surgery: {
        key: 'Surgery',
        label: 'Surgery',
        type: 'action',
        action: {
          id: '1',
          type: 'create',
          description: 'Issue Lumpectomy of breast procedure',
          resource: {
            resourceType: 'ServiceRequest',
            code: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '392021009',
                  display: 'Lumpectomy of breast (procedure)',
                },
              ],
              text: 'Lumpectomy of breast (procedure)',
            },
          },
        },
        transitions: [{ id: '1', transition: 'ChemoMedication' }],
        cql:
          '[Procedure: "Lumpectomy of breast (procedure) code"] Lumpectomy return Tuple{ resourceType: \'Procedure\', id: Lumpectomy.id.value, status: Lumpectomy.status.value, startTime: Lumpectomy.performedPeriod.start, endTime: Lumpectomy.performedPeriod.end }',
        elm: {
          library: {
            identifier: {
              id: '1',
              version: '1.0',
            },
            schemaIdentifier: {
              id: '1',
              version: '1.0',
            },
            usings: {
              def: [],
            },
            includes: {
              def: [],
            },
            valueSets: {
              def: [],
            },
            codeSystems: {
              def: [],
            },
            codes: {
              def: [],
            },
            statements: {
              def: [
                {
                  name: 'Tumor Size',
                  context: 'Patient',
                  expression: {},
                },
              ],
            },
          },
        },
      },
      Radiation: {
        key: 'Radiation',
        label: 'Radiation',
        type: 'action',
        action: {
          id: '1',
          type: 'create',
          description: 'Issue Teleradiotherapy procedure',
          resource: {
            resourceType: 'ServiceRequest',
            code: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '33195004',
                  display: 'Teleradiotherapy procedure (procedure)',
                },
              ],
              text: 'Teleradiotherapy procedure (procedure)',
            },
          },
        },
        cql: '',
        elm: {
          library: {
            identifier: {
              id: '1',
              version: '1.0',
            },
            schemaIdentifier: {
              id: '1',
              version: '1.0',
            },
            usings: {
              def: [],
            },
            includes: {
              def: [],
            },
            valueSets: {
              def: [],
            },
            codeSystems: {
              def: [],
            },
            codes: {
              def: [],
            },
            statements: {
              def: [
                {
                  name: 'Tumor Size',
                  context: 'Patient',
                  expression: {},
                },
              ],
            },
          },
        },
        transitions: [],
      },
      OtherRadiation: {
        key: 'OtherRadiation',
        label: 'Other Radiation',
        type: 'action',
        action: {
          id: '1',
          type: 'create',
          description: 'Issue Teleradiotherapy procedure',
          resource: {
            resourceType: 'ServiceRequest',
            code: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '33195004',
                  display: 'Teleradiotherapy procedure (procedure)',
                },
              ],
              text: 'Teleradiotherapy procedure (procedure)',
            },
          },
        },
        cql:
          '[Procedure: "Teleradiotherapy procedure (procedure) code"] Radiation return Tuple{ resourceType: \'Procedure\', id: Radiation.id.value, status: Radiation.status.value }',
        elm: {
          library: {
            identifier: {
              id: '1',
              version: '1.0',
            },
            schemaIdentifier: {
              id: '1',
              version: '1.0',
            },
            usings: {
              def: [],
            },
            includes: {
              def: [],
            },
            valueSets: {
              def: [],
            },
            codeSystems: {
              def: [],
            },
            codes: {
              def: [],
            },
            statements: {
              def: [
                {
                  name: 'Tumor Size',
                  context: 'Patient',
                  expression: {},
                },
              ],
            },
          },
        },
        transitions: [],
      },
      Chemo: {
        key: 'Chemo',
        label: 'Chemotherapy',
        type: 'action',
        action: {
          id: '1',
          type: 'create',
          description: 'Begin Chemotherapy procedure',
          resource: {
            resourceType: 'ServiceRequest',
            code: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '367336001',
                  display: 'Chemotherapy (procedure)',
                },
              ],
              text: 'Chemotherapy (procedure)',
            },
          },
        },
        cql:
          '[Procedure: "Chemotherapy (procedure) code"] Chemo return Tuple{ resourceType: \'Procedure\', id: Chemo.id.value, status: Chemo.status.value }',
        elm: {
          library: {
            identifier: {
              id: '1',
              version: '1.0',
            },
            schemaIdentifier: {
              id: '1',
              version: '1.0',
            },
            usings: {
              def: [],
            },
            includes: {
              def: [],
            },
            valueSets: {
              def: [],
            },
            codeSystems: {
              def: [
                {
                  id: 'http://snomed.info/sct',
                  name: 'SNOMED',
                  accessLevel: 'Public',
                },
              ],
            },
            codes: {
              def: [
                {
                  id: '367336001',
                  name: 'Chemotherapy code',
                  accessLevel: 'Public',
                  codeSystem: {
                    name: 'SNOMED',
                  },
                },
              ],
            },
            statements: {
              def: [
                {
                  name: 'Tumor Size',
                  context: 'Patient',
                  expression: {},
                },
              ],
            },
          },
        },
        transitions: [],
      },
      ChemoMedication: {
        key: 'ChemoMedication',
        label: 'ChemoMedication Request',
        type: 'action',
        action: {
          id: '1',
          type: 'create',
          description: 'Request 10ML Doxorubicin Hydrochloride 2MG/ML Injection',
          resource: {
            resourceType: 'MedicationRequest',
            medicationCodeableConcept: {
              coding: [
                {
                  system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                  code: '1790099',
                  display: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection',
                },
              ],
              text: '10 ML Doxorubicin Hydrochloride 2 MG/ML Injection',
            },
          },
        },
        cql:
          '[MedicationRequest: "10 ML Doxorubicin Hydrochloride 2 MG/ML Injection code"] ChemoMedication where ToConcept(ChemoMedication.medication as FHIR.CodeableConcept) ~ "10 ML Doxorubicin Hydrochloride 2 MG/ML Injection"return Tuple{ resourceType: \'MedicationRequest\', id: ChemoMedication.id.value, status: ChemoMedication.status.value }',
        elm: {
          library: {
            identifier: {
              id: '1',
              version: '1.0',
            },
            schemaIdentifier: {
              id: '1',
              version: '1.0',
            },
            usings: {
              def: [],
            },
            includes: {
              def: [],
            },
            valueSets: {
              def: [],
            },
            codeSystems: {
              def: [],
            },
            codes: {
              def: [],
            },
            statements: {
              def: [
                {
                  name: 'Tumor Size',
                  context: 'Patient',
                  expression: {},
                },
              ],
            },
          },
        },
        transitions: [{ id: '1', transition: 'Chemo' }],
      },
    },
    elm: {
      navigational: { test: 1 },
      preconditions: { test: 1 },
    },
  },
];
