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
  currentCriteria: BuilderModel | null;
  criteriaName: string;
  setBuildCriteriaSelected: (buildCriteriaSelect: boolean) => void;
  setCurrentCriteriaNodeId: (id: string) => void;
  setCurrentCriteria: (currentCriteria: BuilderModel | null) => void;
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
  const [currentCriteriaCql, setCurrentCriteria] = useState<BuilderModel | null>(null);
  const [buildCriteriaSelected, setBuildCriteriaSelected] = useState<boolean>(false);
  const [criteriaName, setCriteriaName] = useState<string>('');

  const resetCurrentCriteria = useCallback(() => {
    setCurrentCriteriaNodeId('');
    setCurrentCriteria(null);
    setBuildCriteriaSelected(false);
    setCriteriaName('');
  }, [setCurrentCriteriaNodeId, setCurrentCriteria, setBuildCriteriaSelected, setCriteriaName]);

  return (
    <CurrentCriteriaContext.Provider
      value={{
        buildCriteriaSelected,
        setBuildCriteriaSelected,
        currentCriteriaNodeId,
        setCurrentCriteriaNodeId,
        currentCriteria: currentCriteriaCql,
        setCurrentCriteria: setCurrentCriteria,
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
