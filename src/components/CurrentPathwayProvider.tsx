import React, {
  ReactNode,
  createContext,
  useContext,
  FC,
  memo,
  useCallback,
  MutableRefObject,
  useEffect
} from 'react';
import { Pathway } from 'pathways-model';
import useRefUndoState from 'hooks/useRefUndoState';
import HotKeys from 'react-hot-keys';
import { updatePathway } from 'utils/backend';
import { useMutation, useQueryCache } from 'react-query';

interface CurrentPathwayContextInterface {
  pathway: Pathway | null;
  pathwayRef: MutableRefObject<Pathway | null>;
  canUndoPathway: boolean;
  canRedoPathway: boolean;
  undoPathway: () => void;
  redoPathway: () => void;
  resetCurrentPathway: (value: Pathway) => void;
  setCurrentPathway: (value: Pathway) => void;
}

export const CurrentPathwayContext = createContext<CurrentPathwayContextInterface>(
  {} as CurrentPathwayContextInterface
);

interface CurrentPathwayProviderProps {
  children: ReactNode;
}

export const CurrentPathwayProvider: FC<CurrentPathwayProviderProps> = memo(({ children }) => {
  const [
    pathway,
    pathwayRef,
    canUndoPathway,
    canRedoPathway,
    _undoPathway,
    _redoPathway,
    _resetPathway,
    _setPathway
  ] = useRefUndoState<Pathway | null>(null);
  const cache = useQueryCache();

  const undoPathway = useCallback(() => {
    _undoPathway();
  }, [_undoPathway]);

  const redoPathway = useCallback(() => {
    _redoPathway();
  }, [_redoPathway]);

  const resetCurrentPathway = useCallback(
    (value: Pathway) => {
      _resetPathway(value);
    },
    [_resetPathway]
  );

  const setCurrentPathway = useCallback(
    (value: Pathway) => {
      _setPathway(value);
    },
    [_setPathway]
  );

  const [mutateUpdatePathway] = useMutation(updatePathway, {
    onSettled: () => cache.invalidateQueries('pathway')
  });

  useEffect(() => {
    if (pathway) mutateUpdatePathway(pathway);
  }, [pathway, mutateUpdatePathway]);

  return (
    <CurrentPathwayContext.Provider
      value={{
        pathway,
        pathwayRef,
        canUndoPathway,
        canRedoPathway,
        undoPathway,
        redoPathway,
        resetCurrentPathway,
        setCurrentPathway
      }}
    >
      <HotKeys keyName="control+z,command+z" onKeyDown={undoPathway}>
        <HotKeys keyName="control+y,command+y" onKeyDown={redoPathway}>
          {children}
        </HotKeys>
      </HotKeys>
    </CurrentPathwayContext.Provider>
  );
});

export const useCurrentPathwayContext = (): CurrentPathwayContextInterface =>
  useContext(CurrentPathwayContext);
