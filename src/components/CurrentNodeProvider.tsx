import React, {
  MutableRefObject,
  createContext,
  useCallback,
  memo,
  ReactNode,
  FC,
  useContext
} from 'react';
import { PathwayNode } from 'pathways-model';
import useRefState from 'utils/useRefState';

interface CurrentNodeContextInterface {
  currentNode: PathwayNode | null;
  currentNodeRef: MutableRefObject<PathwayNode | null>;
  setCurrentNode: (value: PathwayNode) => void;
}

export const CurrentNodeContext = createContext<CurrentNodeContextInterface>(
  {} as CurrentNodeContextInterface
);

interface CurrentNodeProviderProps {
  children: ReactNode;
}

export const CurrentNodeProvider: FC<CurrentNodeProviderProps> = memo(({ children }) => {
  const [currentNode, currentNodeRef, _setCurrentNode] = useRefState<PathwayNode | null>(null);

  const setCurrentNode = useCallback(
    (value: PathwayNode) => {
      _setCurrentNode(value);
    },
    [_setCurrentNode]
  );

  return (
    <CurrentNodeContext.Provider value={{ currentNode, currentNodeRef, setCurrentNode }}>
      {children}
    </CurrentNodeContext.Provider>
  );
});

export const useCurrentNodeContext = (): CurrentNodeContextInterface =>
  useContext(CurrentNodeContext);
