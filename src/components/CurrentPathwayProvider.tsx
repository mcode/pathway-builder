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
import { useCriteriaContext } from './CriteriaProvider';
import produce from 'immer';

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
  const { criteria } = useCriteriaContext();

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

  useEffect(() => {
    if (pathway) {
      updatePathway(pathway);
    }
  }, [pathway]);

  // Update criteriaSource if criteria change
  useEffect(() => {
    if (!pathway) return;

    let updated = false;
    const criteriaIds = criteria.map(crit => crit.id);
    const newPathway = produce(pathway, draftPathway => {
      Object.entries(draftPathway.nodes).forEach(([nodeIndex, node]) => {
        node.transitions.forEach(({ condition }, transitionIndex) => {
          // If a matching criteria does not already exist, try and find one
          if (condition && !criteriaIds.includes(condition.criteriaSource as string)) {
            const [library, statement] = condition.cql.split('.');
            const criteriaSource = criteria.find(
              crit => crit.elm?.library.identifier.id === library && crit.statement === statement
            )?.id;
            // Only update if a criteria source is actually found.
            if (criteriaSource) {
              const condition =
                draftPathway.nodes[nodeIndex].transitions[transitionIndex].condition;
              if (condition) {
                updated = true;
                condition.criteriaSource = criteriaSource;
              }
            }
          }
        });
      });
    });
    if (updated) resetCurrentPathway(newPathway);
  }, [criteria, pathway, resetCurrentPathway]);

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
