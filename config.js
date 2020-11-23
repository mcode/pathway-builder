CONFIG = {
  mapper: null, // mapper name from fhir-mapper -- allows mapping of incoming FHIR resources
  cqlToElmWebserviceUrl: 'https://cql-translation-service-zfk47ib3kq-uc.a.run.app/cql/translator?annotations=true&result-types=true',
    'http://moonshot-dev.mitre.org:8080/cql/translator?annotations=true&result-types=true',
  pathwaysService: 'https://mcode.github.io/pathways/static/pathways/',
  pathwaysBackend: 'http://localhost:8000',
  demoPathwaysService: './static/pathways/',
  demoPatients: './static/demoData/',
  demoCriteria: './static/cql/'
};
