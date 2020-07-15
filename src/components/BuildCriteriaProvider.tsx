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
  updateBuildCriteriaNodeId: (id: string) => void;
}

export const BuildCriteriaContext = createContext<BuildCriteriaContextInterface>(
  {} as BuildCriteriaContextInterface
);

interface BuildCriteriaProviderProps {
  children: ReactNode;
}

export const BuildCriteriaProvider: FC<BuildCriteriaProviderProps> = memo(({ children }) => {
  const [buildCriteriaNodeId, setBuildCriteriaNodeId] = useState<string>('');

  const updateBuildCriteriaNodeId = useCallback(
    (id: string) => {
      setBuildCriteriaNodeId(id);
    },
    [setBuildCriteriaNodeId]
  );

  return (
    <BuildCriteriaContext.Provider value={{ buildCriteriaNodeId, updateBuildCriteriaNodeId }}>
      {children}
    </BuildCriteriaContext.Provider>
  );
});

export const useBuildCriteriaContext = (): BuildCriteriaContextInterface =>
  useContext(BuildCriteriaContext);
