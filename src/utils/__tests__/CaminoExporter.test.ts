import her2pathway from './fixtures/her2_pathway.json';
import samplepathway from './fixtures/sample_pathway.json';
import neoadjuvantpathway from './fixtures/neoadjuvant_pathway.json';
import { CaminoExporter } from '../CaminoExporter';
import { Pathway } from 'pathways-model';

const testPathways: Record<string, Pathway> = {
  'Sample Pathway': samplepathway as Pathway,
  'HER 2 Pathway': her2pathway as Pathway,
  'Neoadjuvant Pathway': neoadjuvantpathway as Pathway
};

describe('convert pathway', () => {
  Object.keys(testPathways).forEach(name => {
    it(`correctly converts ${name} to a form that can be turned into JSON`, () => {
      const exporter = new CaminoExporter(testPathways[name], []);
      const caminoPathway = exporter.export();
      JSON.stringify(caminoPathway, undefined, 2);
    });
  });
});
