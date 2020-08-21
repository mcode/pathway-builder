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
import { Criteria } from 'criteria-model';

interface CriteriaContextInterface {
  criteria: Criteria[];
  addCriteria: (file: File) => void;
  deleteCriteria: (id: string) => void;
  addElmCriteria: (elm: ElmLibrary, criteriaName: string) => string;
}

export const CriteriaContext = createContext<CriteriaContextInterface>(
  {} as CriteriaContextInterface
);

interface CriteriaProviderProps {
  children: ReactNode;
}

function jsonToCriteria(rawElm: string): Criteria[] | undefined {
  const elm = JSON.parse(rawElm);
  if (!elm.library?.identifier) {
    alert('Please upload ELM file');
    return;
  }
  const defaultStatementNames = [
    'Patient',
    'MeetsInclusionCriteria',
    'InPopulation',
    'Recommendation',
    'Rationale',
    'Errors'
  ];
  const allElmStatements: ElmStatement[] = elm.library.statements.def;
  const elmStatements = allElmStatements.filter(def => !defaultStatementNames.includes(def.name));
  if (!elmStatements) {
    alert('No elm statement found in that file');
    return;
  }
  return elmStatements.map(statement => {
    return {
      id: shortid.generate(),
      label: `${elm.library.identifier.id}: ${statement.name}`,
      version: elm.library.identifier.version,
      modified: Date.now(),
      elm: elm,
      statement: statement.name
    };
  });
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
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>): void => {
      if (event.target?.result) {
        const rawElm = event.target.result as string;
        const newCriteria = jsonToCriteria(rawElm);
        console.log(newCriteria);
        if (newCriteria) setCriteria(currentCriteria => [...currentCriteria, ...newCriteria]);
      } else alert('Unable to read that file');
    };
    reader.readAsText(file);
  }, []);

  const deleteCriteria = useCallback((id: string) => {
    setCriteria(currentCriteria => currentCriteria.filter(criteria => criteria.id !== id));
  }, []);

  const addElmCriteria = useCallback((elm: ElmLibrary, criteriaName: string): string => {
    const newCriteria: Criteria = {
      id: shortid.generate(),
      label: criteriaName,
      version: elm.library.identifier.version,
      modified: Date.now(),
      elm: elm
    };
    setCriteria(currentCriteria => [...currentCriteria, newCriteria]);

    return newCriteria.id;
  }, []);

  return (
    <CriteriaContext.Provider
      value={{
        criteria,
        addCriteria,
        deleteCriteria,
        addElmCriteria
      }}
    >
      {children}
    </CriteriaContext.Provider>
  );
});

export const useCriteriaContext = (): CriteriaContextInterface => useContext(CriteriaContext);
