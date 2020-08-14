import React, {
  createContext,
  FC,
  ReactNode,
  memo,
  useState,
  useCallback,
  useContext
} from 'react';

interface BuildCriteriaCql {
  cql: string;
  text?: string;
}

interface BuildCriteriaContextInterface {
  buildCriteriaNodeId: string;
  buildCriteriaCql: BuildCriteriaCql | null;
  updateBuildCriteriaNodeId: (id: string) => void;
  updateBuildCriteriaCql: (buildCriteriaCql: BuildCriteriaCql | null) => void;
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

  const updateBuildCriteriaNodeId = useCallback(
    (id: string) => {
      setBuildCriteriaNodeId(id);
    },
    [setBuildCriteriaNodeId]
  );

  const updateBuildCriteriaCql = useCallback(
    (buildCriteriaCql: BuildCriteriaCql | null) => {
      setBuildCriteriaCql(buildCriteriaCql);
    },
    [setBuildCriteriaCql]
  );

  return (
    <BuildCriteriaContext.Provider
      value={{
        buildCriteriaNodeId,
        updateBuildCriteriaNodeId,
        buildCriteriaCql,
        updateBuildCriteriaCql
      }}
    >
      {children}
    </BuildCriteriaContext.Provider>
  );
});

export const useBuildCriteriaContext = (): BuildCriteriaContextInterface =>
  useContext(BuildCriteriaContext);
