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
      _resetPathway(value);
    },
    [_resetPathway]
  );

  const setPathway = useCallback(
    (value: Pathway) => {
      _setPathway(value);
    },
    [_setPathway]
  );

  useEffect(() => {
    if (pathway) updatePathway(pathway);
  }, [pathway, updatePathway]);

  // // Update CurrentNode based on undo
  // useEffect(() => {
  //   let newCurrentNodeKey;
  //   if (pathway && currentNodeRef.current) {
  //     if (Object.keys(pathway.nodes).includes(currentNodeRef.current.key)) {
  //       // Update current node to use the latest value of the node from the pathway
  //       newCurrentNodeKey = currentNodeRef.current.key;
  //     } else if (!Object.keys(pathway.nodes).includes(currentNodeRef.current.key)) {
  //       // Current node is set but it has been deleted and default to start
  //       newCurrentNodeKey = 'Start';
  //     }
  //   }

  //   console.log('Updating based on undo');
  //   console.log('oldCurrentNodeKey:' + currentNodeRef.current?.key);
  //   console.log('newCurrentNodeKey: ' + newCurrentNodeKey);
  //   console.log(pathway);
  //   if (pathway && newCurrentNodeKey) {
  //     setCurrentNode(pathway.nodes[newCurrentNodeKey]);
  //     // updatePathway(pathway);
  //     // redirect(pathway.id, newCurrentNodeKey, history);
  //   }
  // }, [pathway, currentNodeRef, setCurrentNode, updatePathway]);

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
      {children}
    </CurrentPathwayContext.Provider>
  );
});

export const useCurrentPathwayContext = (): CurrentPathwayContextInterface =>
  useContext(CurrentPathwayContext);
