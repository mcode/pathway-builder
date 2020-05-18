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
import { library } from '@fortawesome/fontawesome-svg-core';

interface Criteria {
  label: string;
  version: string;
  modified: number;
  cql: string;
}

interface CriteriaContextInterface {
  criteria: Criteria[];
  addCriteria: (file: File) => void;
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
    reader.onload = event => {
      if (event.target?.result) {
        const cql = event.target.result as string;
        const libraryInfo = extractCQLLibraryInfo.exec(cql);
        const criteria = {
          label: libraryInfo ? libraryInfo[1].replace('"', '') : 'Error Reading Label',
          version: libraryInfo ? libraryInfo[2] : 'Unknown',
          modified: file.lastModified,
          cql: cql
        };
        setCriteria(currentCriteria => [...currentCriteria, criteria]);
      } else alert('Unable to read that file');
    };
    reader.readAsText(file);
  }, []);

  return (
    <CriteriaContext.Provider value={{ criteria, addCriteria }}>
      {children}
    </CriteriaContext.Provider>
  );
});

export const useCriteriaContext = (): CriteriaContextInterface => useContext(CriteriaContext);
