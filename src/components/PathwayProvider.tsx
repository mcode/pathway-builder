import React, {
  FC,
  memo,
  createContext,
  useCallback,
  useContext,
  useEffect,
  ReactNode
} from 'react';
import { Pathway } from 'pathways-model';
import { ServiceLoaded } from 'pathways-objects';
import config from 'utils/ConfigManager';
import useGetService from './Services';
import useRefState from 'utils/useRefState';

interface PathwayContextInterface {
  pathways: Pathway[];
  status: string;
  addPathway: (pathway: Pathway) => void;
  deletePathway: (id: string) => void;
  updatePathway: (pathway: Pathway) => void;
}

export const PathwayContext = createContext<PathwayContextInterface>({} as PathwayContextInterface);

interface PathwayProviderProps {
  children: ReactNode;
}

export const PathwayProvider: FC<PathwayProviderProps> = memo(function PathwayProvider({
  children
}) {
  const [pathways, pathwaysRef, setPathways] = useRefState<Pathway[]>([]);
  const service = useGetService<Pathway>(config.get('demoPathwaysService'));
  const servicePayload = (service as ServiceLoaded<Pathway[]>).payload;

  const addPathway = useCallback(
    (pathway: Pathway) => {
      setPathways((currentPathways: Pathway[]) => [...currentPathways, pathway]);
    },
    [setPathways]
  );

  const deletePathway = useCallback(
    (id: string) => {
      setPathways((currentPathways: Pathway[]) =>
        currentPathways.filter(pathway => pathway.id !== id)
      );
    },
    [setPathways]
  );

  const updatePathway = useCallback(
    (newPathway: Pathway) => {
      const index = pathwaysRef.current.findIndex(pathway => pathway.id === newPathway.id);
      setPathways((currentPathways: Pathway[]) => [
        ...currentPathways.slice(0, index),
        newPathway,
        ...currentPathways.slice(index + 1)
      ]);
    },
    [pathwaysRef, setPathways]
  );

  useEffect(() => {
    if (servicePayload) setPathways(servicePayload);
  }, [servicePayload, setPathways]);

  switch (service.status) {
    case 'error':
      return <div>Error loading pathways</div>;

    default:
      return (
        <PathwayContext.Provider
          value={{
            pathways,
            addPathway,
            deletePathway,
            updatePathway,
            status: service.status
          }}
        >
          {children}
        </PathwayContext.Provider>
      );
  }
});

export const usePathwayContext = (): PathwayContextInterface => useContext(PathwayContext);
