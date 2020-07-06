import React, {
  FC,
  memo,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react';
import { Pathway } from 'pathways-model';
import { ServiceLoaded } from 'pathways-objects';
import config from 'utils/ConfigManager';
import useGetService from './Services';

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

export const PathwayProvider: FC<PathwayProviderProps> = memo(({ children }) => {
  const [pathways, setPathways] = useState<Pathway[]>([]);
  const service = useGetService<Pathway>(config.get('demoPathwaysService'));
  const servicePayload = (service as ServiceLoaded<Pathway[]>).payload;

  const addPathway = useCallback((pathway: Pathway) => {
    setPathways(currentPathways => [...currentPathways, pathway]);
  }, []);

  const deletePathway = useCallback((id: string) => {
    setPathways(currentPathways => currentPathways.filter(pathway => pathway.id !== id));
  }, []);

  const updatePathway = useCallback(
    (newPathway: Pathway) => {
      const index = pathways.findIndex(pathway => pathway.id === newPathway.id);
      setPathways(currentPathways => [
        ...currentPathways.slice(0, index),
        newPathway,
        ...currentPathways.slice(index + 1)
      ]);
    },
    [pathways]
  );

  useEffect(() => {
    if (servicePayload) setPathways(servicePayload);
  }, [servicePayload]);

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
