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
import useRefState from 'utils/useRefState';

interface CurrentPathwayContextInterface {
  pathway: Pathway | null;
  pathwayRef: MutableRefObject<Pathway | null>;
  setPathway: (value: Pathway) => void;
}

export const CurrentPathwayContext = createContext<CurrentPathwayContextInterface>(
  {} as CurrentPathwayContextInterface
);

interface CurrentPathwayProviderProps {
  children: ReactNode;
}

export const CurrentPathwayProvider: FC<CurrentPathwayProviderProps> = memo(({ children }) => {
  const [pathway, pathwayRef, _setPathway] = useRefState<Pathway | null>(null);

  const setPathway = useCallback(
    (value: Pathway) => {
      _setPathway(value);
    },
    [_setPathway]
  );

  return (
    <CurrentPathwayContext.Provider value={{ pathway, pathwayRef, setPathway }}>
      {children}
    </CurrentPathwayContext.Provider>
  );
});

export const useCurrentPathwayContext = (): CurrentPathwayContextInterface =>
  useContext(CurrentPathwayContext);
