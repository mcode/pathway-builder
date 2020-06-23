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
import { ElmStatement } from 'elm-model';
import under2cm from 'components/Tumor-Size-2cm-and-Under.json';
import over2cm from 'components/Tumor-Size-Over-2cm.json';

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

function JSONtoCriteria(rawElm: string): Criteria | undefined {
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
  const newCriteria: Criteria = {
    id: shortid.generate(),
    label: elm.library.identifier.id,
    version: elm.library.identifier.version,
    modified: Date.now(),
    elm: elm
  };
  return newCriteria;
}

export const CriteriaProvider: FC<CriteriaProviderProps> = memo(({ children }) => {
  const under2cmCriteria = JSONtoCriteria(JSON.stringify(under2cm));
  const over2cmCriteria = JSONtoCriteria(JSON.stringify(over2cm));

  let defaultCriteria: Criteria[] = [];
  if (under2cmCriteria && over2cmCriteria) defaultCriteria = [under2cmCriteria, over2cmCriteria];
  const [criteria, setCriteria] = useState<Criteria[]>(defaultCriteria);

  const addCriteria = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>): void => {
      if (event.target?.result) {
        const rawElm = event.target.result as string;
        const newCriteria = JSONtoCriteria(rawElm);
        if (newCriteria) setCriteria(currentCriteria => [...currentCriteria, newCriteria]);
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
