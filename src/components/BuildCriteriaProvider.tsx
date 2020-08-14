import React, {
  createContext,
  FC,
  ReactNode,
  memo,
  useState,
  useCallback,
  useContext
} from 'react';

interface BuildCriteriaContextInterface {
  buildCriteriaNodeId: string;
  buildCriteriaCql: string;
  updateBuildCriteriaNodeId: (id: string) => void;
  updateBuildCriteriaCql: (cql: string) => void;
}

export const BuildCriteriaContext = createContext<BuildCriteriaContextInterface>(
  {} as BuildCriteriaContextInterface
);

interface BuildCriteriaProviderProps {
  children: ReactNode;
}

export const BuildCriteriaProvider: FC<BuildCriteriaProviderProps> = memo(({ children }) => {
  const [buildCriteriaNodeId, setBuildCriteriaNodeId] = useState<string>('');
  const [buildCriteriaCql, setBuildCriteriaCql] = useState<string>('');

  const updateBuildCriteriaNodeId = useCallback(
    (id: string) => {
      setBuildCriteriaNodeId(id);
    },
    [setBuildCriteriaNodeId]
  );

  const updateBuildCriteriaCql = useCallback(
    (cql: string) => {
      setBuildCriteriaCql(cql);
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
