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
import { useCurrentNodeContext } from 'components/CurrentNodeProvider';
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
  const { currentNode, setCurrentNode } = useCurrentNodeContext();
  const { updatePathway } = usePathwaysContext();

  const undoPathway = useCallback(() => {
    _undoPathway();
    // Update Pathways Context
    if (pathway) updatePathway(pathway);
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

  // Update CurrentNode based on undo
  useEffect(() => {
    let newCurrentNodeKey;
    if (pathway && currentNode && Object.keys(pathway.nodes).includes(currentNode.key)) {
      // Update current node to use the latest value of the node from the pathway
      newCurrentNodeKey = currentNode.key;
    } else if (pathway && currentNode && !Object.keys(pathway.nodes).includes(currentNode.key)) {
      // Current node is set but it has been deleted and default to start
      newCurrentNodeKey = 'Start';
    }

    if (pathway && newCurrentNodeKey) {
      setCurrentNode(pathway?.nodes[newCurrentNodeKey]);
      // redirect(pathway.id, newCurrentNodeKey, history);
    }
  }, [pathway, currentNode, setCurrentNode]);

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
