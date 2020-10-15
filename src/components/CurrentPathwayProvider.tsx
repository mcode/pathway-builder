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
import useRefUndoState from 'utils/useRefUndoState';
import { usePathwaysContext } from './PathwaysProvider';
import HotKeys from 'react-hot-keys';

interface CurrentPathwayContextInterface {
  pathway: Pathway | null;
  pathwayRef: MutableRefObject<Pathway | null>;
  canUndoPathway: boolean;
  canRedoPathway: boolean;
  undoPathway: () => void;
  redoPathway: () => void;
  resetPathway: (value: Pathway) => void;
  setPathway: (value: Pathway) => void;
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
  const { updatePathway } = usePathwaysContext();

  const undoPathway = useCallback(() => {
    _undoPathway();
  }, [_undoPathway]);

  const redoPathway = useCallback(() => {
    _redoPathway();
  }, [_redoPathway]);

  const resetPathway = useCallback(
    (value: Pathway) => {
      console.log('resetPathway');
      _resetPathway(value);
    },
    [_resetPathway]
  );

  const setPathway = useCallback(
    (value: Pathway) => {
      console.log('setPathway');
      _setPathway(value);
    },
    [_setPathway]
  );

  useEffect(() => {
    if (pathway) updatePathway(pathway);
  }, [pathway, updatePathway]);

  return (
    <CurrentPathwayContext.Provider
      value={{
        pathway,
        pathwayRef,
        canUndoPathway,
        canRedoPathway,
        undoPathway,
        redoPathway,
        resetPathway,
        setPathway
      }}
    >
      <HotKeys keyName="control+z" onKeyDown={undoPathway}>
        <HotKeys keyName="control+y" onKeyDown={redoPathway}>
          {children}
        </HotKeys>
      </HotKeys>
    </CurrentPathwayContext.Provider>
  );
});

export const useCurrentPathwayContext = (): CurrentPathwayContextInterface =>
  useContext(CurrentPathwayContext);
