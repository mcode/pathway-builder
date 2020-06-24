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
import useGetPathwaysService from './PathwaysService';

interface PathwayContextInterface {
  pathways: Pathway[];
  status: string;
  addPathway: (pathway: Pathway) => void;
  deletePathway: (id: string) => void;
  updatePathwayAtIndex: (pathway: Pathway, index: number) => void;
}

export const PathwayContext = createContext<PathwayContextInterface>({} as PathwayContextInterface);

interface PathwayProviderProps {
  children: ReactNode;
}

export const PathwayProvider: FC<PathwayProviderProps> = memo(({ children }) => {
  const [pathways, setPathways] = useState<Pathway[]>([]);
  const service = useGetPathwaysService(config.get('demoPathwaysService'));
  const servicePayload = (service as ServiceLoaded<Pathway[]>).payload;

  const addPathway = useCallback((pathway: Pathway) => {
    setPathways(currentPathways => [...currentPathways, pathway]);
  }, []);

  const deletePathway = useCallback((id: string) => {
    setPathways(currentPathways => currentPathways.filter(pathway => pathway.id !== id));
  }, []);

  const updatePathwayAtIndex = useCallback((pathway: Pathway, index: number) => {
    setPathways(currentPathways => [
      ...currentPathways.slice(0, index),
      pathway,
      ...currentPathways.slice(index + 1)
    ]);
  }, []);

  console.log('Pathway Payload');
  console.log(servicePayload);

  useEffect(() => {
    if (servicePayload) setPathways(servicePayload);
  }, [servicePayload]);

  console.log('Pathway Payload2');
  console.log(servicePayload);

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
            updatePathwayAtIndex,
            status: service.status
          }}
        >
          {children}
        </PathwayContext.Provider>
      );
  }
});

export const usePathwayContext = (): PathwayContextInterface => useContext(PathwayContext);
