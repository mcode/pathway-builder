CONFIG = {
  mapper: null, // mapper name from fhir-mapper -- allows mapping of incoming FHIR resources
  cqlToElmWebserviceUrl: 'http://moonshot-dev.mitre.org:8080/cql/translator?annotations=true&result-types=true',
  pathwaysService: 'http://pathways.mitre.org:3002/pathways/',
  demoPathwaysService: './static/pathways/',
  demoPatients: './static/demoData/',
  demoCriteria: './static/criteria/'
};
