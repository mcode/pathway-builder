import React, {
  createContext,
  ReactNode,
  FC,
  useState,
  memo,
  useContext,
  useCallback,
  useEffect
} from 'react';
import shortid from 'shortid';
import { ElmStatement } from 'elm-model';
import config from 'utils/ConfigManager';
import useGetService from './Services';
import { ServiceLoaded } from 'pathways-objects';

interface Precondition {
  id: string;
  label: string;
  version: string;
  modified: number;
  elm: object;
}

interface PreconditionContextInterface {
  precondition: Precondition[];
  addPrecondition: (file: File) => void;
  deletePrecondition: (id: string) => void;
}

export const PreconditionContext = createContext<PreconditionContextInterface>(
  {} as PreconditionContextInterface
);

interface PreconditionProviderProps {
  children: ReactNode;
}

function jsonToPrecondition(rawElm: string): Precondition | undefined {
  const elm = JSON.parse(rawElm);
  if (!elm.library?.identifier) {
    alert('Please upload ELM file');
    return;
  }
  const defaultStatementNames = [
    'Patient',
    'MeetsInclusionPrecondition',
    'InPopulation',
    'Recommendation',
    'Rationale',
    'Errors'
  ];
  const elmStatements: ElmStatement[] = elm.library.statements.def;
  const elmStatement = elmStatements.find(def => !defaultStatementNames.includes(def.name));
  if (!elmStatement) {
    alert('No elm statement found in that file');
    return;
  }
  const newPrecondition: Precondition = {
    id: shortid.generate(),
    label: elm.library.identifier.id,
    version: elm.library.identifier.version,
    modified: Date.now(),
    elm: elm
  };
  return newPrecondition;
}

export const PreconditionProvider: FC<PreconditionProviderProps> = memo(({ children }) => {
  const [precondition, setPrecondition] = useState<Precondition[]>([]);
  const service = useGetService<Precondition>(config.get('demoPrecondition'));
  const payload = (service as ServiceLoaded<Precondition[]>).payload;

  useEffect(() => {
    const defaultPrecondition: Precondition[] = [];
    if (payload) {
      payload.forEach(jsonCriterion => {
        const criterion = jsonToPrecondition(JSON.stringify(jsonCriterion));
        if (criterion) defaultPrecondition.push(criterion);
      });
    }
    setPrecondition(defaultPrecondition);
  }, [payload]);

  const addPrecondition = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>): void => {
      if (event.target?.result) {
        const rawElm = event.target.result as string;
        const newPrecondition = jsonToPrecondition(rawElm);
        if (newPrecondition)
          setPrecondition(currentPrecondition => [...currentPrecondition, newPrecondition]);
      } else alert('Unable to read that file');
    };
    reader.readAsText(file);
  }, []);

  const deletePrecondition = useCallback((id: string) => {
    setPrecondition(currentPrecondition =>
      currentPrecondition.filter(precondition => precondition.id !== id)
    );
  }, []);

  return (
    <PreconditionContext.Provider value={{ precondition, addPrecondition, deletePrecondition }}>
      {children}
    </PreconditionContext.Provider>
  );
});

export const usePreconditionContext = (): PreconditionContextInterface =>
  useContext(PreconditionContext);
