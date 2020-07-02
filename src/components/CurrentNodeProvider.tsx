import React, {
  MutableRefObject,
  createContext,
  useCallback,
  memo,
  ReactNode,
  FC,
  useContext
} from 'react';
import { State } from 'pathways-model';
import useRefState from 'utils/useRefState';

interface CurrentNodeContextInterface {
  currentNode: State | null;
  currentNodeRef: MutableRefObject<State | null>;
  setCurrentNode: (value: State) => void;
}

export const CurrentNodeContext = createContext<CurrentNodeContextInterface>(
  {} as CurrentNodeContextInterface
);

interface CurrentNodeProviderProps {
  children: ReactNode;
}

export const CurrentNodeProvider: FC<CurrentNodeProviderProps> = memo(({ children }) => {
  const [currentNode, currentNodeRef, _setCurrentNode] = useRefState<State | null>(null);

  const setCurrentNode = useCallback(
    (value: State) => {
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
