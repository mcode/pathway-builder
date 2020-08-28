import React, {
  createContext,
  FC,
  ReactNode,
  memo,
  useState,
  useContext,
  useCallback
} from 'react';

import { BuilderModel } from 'criteria-model';

interface CurrentCriteriaCql {
  cql: string;
  text?: string;
}

interface CurrentCriteriaContextInterface {
  buildCriteriaSelected: boolean;
  currentCriteriaNodeId: string;
  currentCriteriaCql: BuilderModel | null;
  criteriaName: string;
  setBuildCriteriaSelected: (buildCriteriaSelect: boolean) => void;
  setCurrentCriteriaNodeId: (id: string) => void;
  setCurrentCriteriaCql: (currentCriteriaCql: BuilderModel | null) => void;
  setCriteriaName: (criteriaName: string) => void;
  resetCurrentCriteria: () => void;
}

export const CurrentCriteriaContext = createContext<CurrentCriteriaContextInterface>(
  {} as CurrentCriteriaContextInterface
);

interface CurrentCriteriaProviderProps {
  children: ReactNode;
}

export const CurrentCriteriaProvider: FC<CurrentCriteriaProviderProps> = memo(({ children }) => {
  const [currentCriteriaNodeId, setCurrentCriteriaNodeId] = useState<string>('');
  const [currentCriteriaCql, setCurrentCriteriaCql] = useState<BuilderModel | null>(null);
  const [buildCriteriaSelected, setBuildCriteriaSelected] = useState<boolean>(false);
  const [criteriaName, setCriteriaName] = useState<string>('');

  const resetCurrentCriteria = useCallback(() => {
    setCurrentCriteriaNodeId('');
    setCurrentCriteriaCql(null);
    setBuildCriteriaSelected(false);
    setCriteriaName('');
  }, [setCurrentCriteriaNodeId, setCurrentCriteriaCql, setBuildCriteriaSelected, setCriteriaName]);

  return (
    <CurrentCriteriaContext.Provider
      value={{
        buildCriteriaSelected,
        setBuildCriteriaSelected,
        currentCriteriaNodeId,
        setCurrentCriteriaNodeId,
        currentCriteriaCql,
        setCurrentCriteriaCql,
        criteriaName,
        setCriteriaName,
        resetCurrentCriteria
      }}
    >
      {children}
    </CurrentCriteriaContext.Provider>
  );
});

export const useCurrentCriteriaContext = (): CurrentCriteriaContextInterface =>
  useContext(CurrentCriteriaContext);
