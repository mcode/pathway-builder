import React, {
  createContext,
  ReactNode,
  FC,
  useState,
  memo,
  useContext,
  useCallback,
  useEffect
} from 'react';
import shortid from 'shortid';
import { ElmStatement, ElmLibrary } from 'elm-model';
import config from 'utils/ConfigManager';
import useGetService from './Services';
import { ServiceLoaded } from 'pathways-objects';
import { Criteria, BuilderModel } from 'criteria-model';

interface CriteriaContextInterface {
  criteria: Criteria[];
  addCriteria: (file: File) => void;
  deleteCriteria: (id: string) => void;
  addElmCriteria: (elm: ElmLibrary) => Criteria[];
  addBuilderCriteria: (criteria: BuilderModel) => Criteria[];
}

export const CriteriaContext = createContext<CriteriaContextInterface>(
  {} as CriteriaContextInterface
);

interface CriteriaProviderProps {
  children: ReactNode;
}

const DEFAULT_ELM_STATEMENTS = [
  'Patient',
  'MeetsInclusionCriteria',
  'InPopulation',
  'Recommendation',
  'Rationale',
  'Errors'
];

function builderModelToCriteria(criteria: BuilderModel): Criteria {
  return {
    id: shortid.generate(),
    label: `${criteria.type}${Date.now()}`,
    modified: Date.now(),
    builder: criteria,
    statement: criteria.cql
  };
}
function elmLibraryToCriteria(elm: ElmLibrary, custom = false): Criteria[] {
  const allElmStatements: ElmStatement[] = elm.library.statements.def;
  let elmStatements = allElmStatements.filter(def => !DEFAULT_ELM_STATEMENTS.includes(def.name));
  const includesTypes = !!allElmStatements.find(s => s.resultTypeName);
  if (includesTypes) {
    // if we have types, filter down to just booleans
    elmStatements = elmStatements.filter(
      s => s.resultTypeName === '{urn:hl7-org:elm-types:r1}Boolean'
    );
  }
  if (!elmStatements) {
    alert('No elm statement found in that file');
    return [];
  }
  const labelTitle = custom
    ? `Criteria Builder (${elm.library.identifier.id.substring(0, 5)})`
    : elm.library.identifier.id;
  return elmStatements.map(statement => {
    return {
      id: shortid.generate(),
      label: `${labelTitle}: ${statement.name}`,
      version: elm.library.identifier.version,
      modified: Date.now(),
      elm: elm,
      statement: statement.name
    };
  });
}

function jsonToCriteria(rawElm: string): Criteria[] | undefined {
  const elm = JSON.parse(rawElm);
  if (!elm.library?.identifier) {
    alert('Please upload ELM file');
    return;
  }
  return elmLibraryToCriteria(elm);
}

export const CriteriaProvider: FC<CriteriaProviderProps> = memo(({ children }) => {
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const service = useGetService<Criteria>(config.get('demoCriteria'));
  const payload = (service as ServiceLoaded<Criteria[]>).payload;

  useEffect(() => {
    if (payload) {
      const newCriteria: Criteria[] = [];
      payload.forEach(jsonCriterion => {
        const criterion = jsonToCriteria(JSON.stringify(jsonCriterion));
        if (criterion) newCriteria.push(...criterion);
      });
      setCriteria(newCriteria);
    }
  }, [payload]);

  const addCriteria = useCallback((file: File) => {
    // figure out incoming file type
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>): void => {
      if (event.target?.result) {
        const rawElm = event.target.result as string;
        const newCriteria = jsonToCriteria(rawElm);
        if (newCriteria) setCriteria(currentCriteria => [...currentCriteria, ...newCriteria]);
      } else alert('Unable to read that file');
    };
    reader.readAsText(file);
  }, []);

  const deleteCriteria = useCallback((id: string) => {
    setCriteria(currentCriteria => currentCriteria.filter(criteria => criteria.id !== id));
  }, []);

  const addElmCriteria = useCallback((elm: ElmLibrary): Criteria[] => {
    const newCriteria = elmLibraryToCriteria(elm, true);
    setCriteria(currentCriteria => [...currentCriteria, ...newCriteria]);

    return newCriteria;
  }, []);

  const addBuilderCriteria = useCallback((criteria: BuilderModel): Criteria[] => {
    const newCriteria = builderModelToCriteria(criteria);
    setCriteria(currentCriteria => [...currentCriteria, newCriteria]);

    return [newCriteria];
  }, []);

  return (
    <CriteriaContext.Provider
      value={{
        criteria,
        addCriteria,
        deleteCriteria,
        addElmCriteria,
        addBuilderCriteria
      }}
    >
      {children}
    </CriteriaContext.Provider>
  );
});

export const useCriteriaContext = (): CriteriaContextInterface => useContext(CriteriaContext);
