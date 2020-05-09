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
import { Pathway, PathwayContextInterface } from 'pathways-model';
import { ServiceLoaded } from 'pathways-objects';
import config from 'utils/ConfigManager';
import useGetPathwaysService from './PathwaysService';

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

  useEffect(() => {
    if (servicePayload) setPathways(servicePayload);
  }, [servicePayload]);

  switch (service.status) {
    case 'error':
      return <div>Error loading pathways</div>;

    default:
      return (
        <PathwayContext.Provider value={{ pathways, addPathway, status: service.status }}>
          {children}
        </PathwayContext.Provider>
      );
  }
});

export const usePathwayContext = (): PathwayContextInterface => useContext(PathwayContext);
