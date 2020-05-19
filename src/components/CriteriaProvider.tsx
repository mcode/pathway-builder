import React, {
  createContext,
  ReactNode,
  FC,
  useState,
  memo,
  useContext,
  useCallback
} from 'react';
import { extractCQLLibraryInfo } from 'utils/regexes';
import shortid from 'shortid';

interface Criteria {
  id: string;
  label: string;
  version: string;
  modified: number;
  cql: string;
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
        const cql = event.target.result as string;
        const libraryInfo = extractCQLLibraryInfo.exec(cql);
        const newCriteria = {
          id: shortid.generate(),
          label: libraryInfo ? libraryInfo[1].replace('"', '') : 'Error Reading Label',
          version: libraryInfo ? libraryInfo[2] : 'Unknown',
          modified: Date.now(),
          cql: cql
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
