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
import JSZip from 'jszip';
import { ElmLibrary } from 'elm-model';
import config from 'utils/ConfigManager';
import useGetService from 'components/StaticApp/Services';
import { ServiceLoaded } from 'pathways-objects';
import { Criteria, BuilderModel } from 'criteria-model';
import {
  builderModelToCriteria,
  cqlToCriteria,
  elmLibraryToCriteria,
  jsonToCriteria
} from 'utils/criteria';
import { CqlLibraries } from 'engine/cql-to-elm';

interface CriteriaContextInterface {
  criteria: Criteria[];
  addCriteria: (file: File) => void;
  addCqlCriteria: (cql: string) => void;
  deleteCriteria: (id: string) => void;
  addElmCriteria: (elm: ElmLibrary) => Criteria[];
  addBuilderCriteria: (
    criteria: BuilderModel,
    label: string,
    criteriaSource: string | undefined
  ) => Criteria[];
}

export const CriteriaContext = createContext<CriteriaContextInterface>(
  {} as CriteriaContextInterface
);

interface CriteriaProviderProps {
  children: ReactNode;
}

export const CriteriaProvider: FC<CriteriaProviderProps> = memo(({ children }) => {
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const service = useGetService<string>(config.get('demoCriteria'), true);
  const payload = (service as ServiceLoaded<string[]>).payload;

  useEffect(() => {
    if (payload) {
      const listOfPromises = payload.map(rawCql => cqlToCriteria(rawCql));
      Promise.all(listOfPromises)
        .then(listOfLists => listOfLists.flat())
        .then(newCriteria => setCriteria(newCriteria));
    }
  }, [payload]);

  const addCqlCriteria = useCallback((cql: string | CqlLibraries) => {
    cqlToCriteria(cql).then(newCriteria => {
      if (newCriteria.length > 0) {
        setCriteria(currentCriteria => {
          // Do not add CQL Criteria that already exists
          return currentCriteria.find(crit => crit.cql === cql)
            ? currentCriteria
            : [...currentCriteria, ...newCriteria];
        });
      } else {
        alert('No valid criteria were found in the provided file');
      }
    });
  }, []);

  const addCriteria = useCallback(
    (file: File) => {
      // figure out incoming file type
      const reader = new FileReader();
      reader.onload = async (event: ProgressEvent<FileReader>): Promise<void> => {
        if (event.target?.result) {
          const rawContent = event.target.result as string;
          // TODO: more robust file type identification?
          if (file.name.endsWith('.json')) {
            const newCriteria = jsonToCriteria(rawContent);
            if (newCriteria) setCriteria(currentCriteria => [...currentCriteria, ...newCriteria]);
          } else if (file.name.endsWith('.cql')) {
            addCqlCriteria(rawContent);
          } else if (file.name.endsWith('.zip')) {
            const cqlLibraries: CqlLibraries = {};
            const zip = await JSZip.loadAsync(file);
            const zipFiles = Object.values(zip.files);
            // Check for criteria in each of the cql files, add cql to libraries if no criteria
            for (let i = 0; i < zipFiles.length; i++) {
              const zipFile = zipFiles[i];

              // Skip files that do not end with .cql
              if (!zipFile.name.endsWith('.cql')) continue;
              const fileContents = await zipFile.async('string');
              cqlLibraries[zipFile.name] = { cql: fileContents };
            }
            addCqlCriteria(cqlLibraries);
          }
        } else alert('Unable to read that file');
      };
      reader.readAsText(file);
    },
    [addCqlCriteria]
  );

  const deleteCriteria = useCallback((id: string) => {
    setCriteria(currentCriteria => currentCriteria.filter(criteria => criteria.id !== id));
  }, []);

  const addElmCriteria = useCallback((elm: ElmLibrary): Criteria[] => {
    const newCriteria = elmLibraryToCriteria(elm, undefined, undefined, true);
    setCriteria(currentCriteria => [...currentCriteria, ...newCriteria]);

    return newCriteria;
  }, []);

  const addBuilderCriteria = useCallback(
    (
      buildCriteria: BuilderModel,
      label: string,
      criteriaSource: string | undefined
    ): Criteria[] => {
      const newCriteria = builderModelToCriteria(buildCriteria, label);
      if (criteriaSource) {
        // Find criteria that is being edited
        const matchingCriteria = criteria.find(c => c.id === criteriaSource);
        if (matchingCriteria) {
          newCriteria.id = matchingCriteria.id;
          setCriteria(currentCriteria => [
            ...currentCriteria.filter(c => c.id !== matchingCriteria.id),
            newCriteria
          ]);
        }
      } else {
        setCriteria(currentCriteria => [...currentCriteria, newCriteria]);
      }

      return [newCriteria];
    },
    [criteria]
  );

  return (
    <CriteriaContext.Provider
      value={{
        criteria,
        addCriteria,
        addCqlCriteria,
        deleteCriteria,
        addElmCriteria,
        addBuilderCriteria
      }}
    >
      {children}
    </CriteriaContext.Provider>
  );
});

export const useCriteriaContext = (): CriteriaContextInterface => useContext(CriteriaContext);
