import React, {
  createContext,
  ReactNode,
  FC,
  useState,
  memo,
  useContext,
  useCallback
} from 'react';
import shortid from 'shortid';
import { ElmStatement } from 'pathways-model';

interface Criteria {
  id: string;
  label: string;
  version: string;
  modified: number;
  elm: object;
}

interface CriteriaContextInterface {
  criteria: Criteria[];
  addCriteria: (file: File) => void;
  deleteCriteria: (id: string) => void;
}

export const CriteriaContext = createContext<CriteriaContextInterface>(
  {} as CriteriaContextInterface
);

interface CriteriaProviderProps {
  children: ReactNode;
}

export const CriteriaProvider: FC<CriteriaProviderProps> = memo(({ children }) => {
  const [criteria, setCriteria] = useState<Criteria[]>([]);

  const addCriteria = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>): void => {
      if (event.target?.result) {
        const rawElm = event.target.result as string;
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
        const elmStatements: ElmStatement[] = elm.library.statements.def;
        const elmStatement = elmStatements.find(def => !defaultStatementNames.includes(def.name));
        if (!elmStatement) {
          alert('No elm statement found in that file');
          return;
        }
        const newCriteria = {
          id: shortid.generate(),
          label: elm.library.identifier.id,
          version: elm.library.identifier.version,
          modified: Date.now(),
          elm: elm
        };
        setCriteria(currentCriteria => [...currentCriteria, newCriteria]);
      } else alert('Unable to read that file');
    };
    reader.readAsText(file);
  }, []);

  const deleteCriteria = useCallback((id: string) => {
    setCriteria(currentCriteria => currentCriteria.filter(criteria => criteria.id !== id));
  }, []);

  return (
    <CriteriaContext.Provider value={{ criteria, addCriteria, deleteCriteria }}>
      {children}
    </CriteriaContext.Provider>
  );
});

export const useCriteriaContext = (): CriteriaContextInterface => useContext(CriteriaContext);
