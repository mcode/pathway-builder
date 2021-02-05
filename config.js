CONFIG = {
  mapper: null, // mapper name from fhir-mapper -- allows mapping of incoming FHIR resources
  cqlToElmWebserviceUrl: 'https://cql-translation-service.herokuapp.com/cql/translator?annotations=true&result-types=true',
  pathwaysService: 'https://mcode.github.io/pathways/static/pathways/',
  pathwaysBackend: 'http://localhost:8000',
  demoPathwaysService: './static/pathways/',
  demoPatients: './static/demoData/',
  demoCriteria: './static/cql/'
};
