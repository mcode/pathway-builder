import React, { createContext, FC, ReactNode, memo, useState, useContext } from 'react';

interface BuildCriteriaCql {
  cql: string;
  text?: string;
}

interface BuildCriteriaContextInterface {
  buildCriteriaSelected: boolean;
  buildCriteriaNodeId: string;
  buildCriteriaCql: BuildCriteriaCql | null;
  criteriaName: string;
  setBuildCriteriaSelected: (buildCriteriaSelect: boolean) => void;
  setBuildCriteriaNodeId: (id: string) => void;
  setBuildCriteriaCql: (buildCriteriaCql: BuildCriteriaCql | null) => void;
  setCriteriaName: (criteriaName: string) => void;
}

export const BuildCriteriaContext = createContext<BuildCriteriaContextInterface>(
  {} as BuildCriteriaContextInterface
);

interface BuildCriteriaProviderProps {
  children: ReactNode;
}

export const BuildCriteriaProvider: FC<BuildCriteriaProviderProps> = memo(({ children }) => {
  const [buildCriteriaNodeId, setBuildCriteriaNodeId] = useState<string>('');
  const [buildCriteriaCql, setBuildCriteriaCql] = useState<BuildCriteriaCql | null>(null);
  const [buildCriteriaSelected, setBuildCriteriaSelected] = useState<boolean>(false);
  const [criteriaName, setCriteriaName] = useState<string>('');

  return (
    <BuildCriteriaContext.Provider
      value={{
        buildCriteriaSelected,
        setBuildCriteriaSelected,
        buildCriteriaNodeId,
        setBuildCriteriaNodeId,
        buildCriteriaCql,
        setBuildCriteriaCql,
        criteriaName,
        setCriteriaName
      }}
    >
      {children}
    </BuildCriteriaContext.Provider>
  );
});

export const useBuildCriteriaContext = (): BuildCriteriaContextInterface =>
  useContext(BuildCriteriaContext);
