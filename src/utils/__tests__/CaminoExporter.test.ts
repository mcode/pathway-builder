import her2pathway from './fixtures/her2_pathway.json';
import samplepathway from './fixtures/sample_pathway.json';
import neoadjuvantpathway from './fixtures/neoadjuvant_pathway.json';
import { CaminoExporter } from '../CaminoExporter';
import { Pathway } from 'pathways-model';
import { Criteria } from 'criteria-model';

const testPathways: Record<string, Pathway> = {
  'Sample Pathway': samplepathway as Pathway,
  'HER 2 Pathway': her2pathway as Pathway,
  'Neoadjuvant Pathway': neoadjuvantpathway as Pathway
};

const simpleCql: string =
  "library LIBFoo version '1.0'\n" +
  '\n' +
  "using FHIR version '4.0.1'\n" +
  '\n' +
  'context Patient\n' +
  '\n' +
  'define "isMale": Patient.gender.value = \'Male\'';

const simpleCriteria: Criteria = {
  id: 'Baz',
  label: 'Baz',
  modified: 1,
  statement: 'isMale',
  elm: {
    library: {
      identifier: {
        id: 'LIBFoo',
        version: '1'
      },
      schemaIdentifier: {
        id: 'qux',
        version: 'qux'
      },
      statements: {
        def: [{ name: 'quux', context: 'quux', expression: {} }]
      }
    }
  },
  cql: simpleCql
};

const simplePathway: Pathway = {
  id: 'foo',
  name: 'Foo',
  description: 'Foo foo',
  library: [simpleCql],
  preconditions: [],
  nodes: {
    Start: {
      key: 'Start',
      label: 'Start',
      transitions: [
        {
          id: 'bar',
          transition: 'Barr',
          condition: {
            description: 'baz',
            cql: 'isMale',
            criteriaSource: 'Baz'
          }
        }
      ],
      type: 'start'
    },
    Barr: {
      key: 'Barr',
      label: 'Barr',
      transitions: [],
      type: 'null'
    }
  }
};

describe('convert pathway', () => {
  Object.keys(testPathways).forEach(name => {
    it(`correctly converts ${name} to a form that can be turned into JSON`, () => {
      const exporter = new CaminoExporter(testPathways[name], [], []);
      exporter.export().then(caminoPathway => JSON.stringify(caminoPathway, undefined, 2));
    });
  });

  it('does not prepend a library again if it is already prepended once', () => {
    const firstExporter = new CaminoExporter(simplePathway, [simpleCriteria], []);
    firstExporter.export().then(firstExport => {
      expect(firstExport.nodes['Start'].transitions[0].condition?.cql).toBe('LIBFoo.isMale');
      const secondExporter = new CaminoExporter(firstExport, [simpleCriteria], []);
      secondExporter
        .export()
        .then(secondExport =>
          expect(secondExport.nodes['Start'].transitions[0].condition?.cql).toBe('LIBFoo.isMale')
        );
    });
  });
});
