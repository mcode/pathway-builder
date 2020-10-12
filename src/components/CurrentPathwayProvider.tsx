import React, {
  ReactNode,
  createContext,
  useContext,
  FC,
  memo,
  useCallback,
  MutableRefObject
} from 'react';
import { Pathway } from 'pathways-model';
import useRefUndoState from 'utils/useRefUndoState';

interface CurrentPathwayContextInterface {
  pathway: Pathway | null;
  pathwayRef: MutableRefObject<Pathway | null>;
  canUndoPathway: boolean;
  canRedoPathway: boolean;
  undoPathway: () => void;
  redoPathway: () => void;
  setPathway: (value: Pathway) => void;
}

export const CurrentPathwayContext = createContext<CurrentPathwayContextInterface>(
  {} as CurrentPathwayContextInterface
);

interface CurrentPathwayProviderProps {
  children: ReactNode;
}

export const CurrentPathwayProvider: FC<CurrentPathwayProviderProps> = memo(({ children }) => {
  const [pathway, pathwayRef, canUndoPathway, canRedoPathway, _undoPathway, _redoPathway, _setPathway] = useRefUndoState<Pathway | null>(null);

  const undoPathway = useCallback(() => {
      _undoPathway();
    },
    [_undoPathway]
  );

  const redoPathway = useCallback(() => {
      _redoPathway();
    },
    [_redoPathway]
  );

  const setPathway = useCallback(
    (value: Pathway) => {
      _setPathway(value);
    },
    [_setPathway]
  );

  return (
    <CurrentPathwayContext.Provider value={{ pathway, pathwayRef, canUndoPathway, canRedoPathway, undoPathway, redoPathway, setPathway }}>
      {children}
    </CurrentPathwayContext.Provider>
  );
});

export const useCurrentPathwayContext = (): CurrentPathwayContextInterface =>
  useContext(CurrentPathwayContext);
