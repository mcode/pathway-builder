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
import config from 'utils/ConfigManager';
import { Criteria, BuilderModel } from 'criteria-model';
import { builderModelToCriteria, cqlToCriteria } from 'utils/criteria';
import { CqlLibraries } from 'engine/cql-to-elm';

interface CriteriaContextInterface {
  criteria: Criteria[];
  addCriteria: (file: File) => void;
  addCqlCriteria: (cql: string) => void;
  deleteCriteria: (id: string) => void;
  addBuilderCriteria: (
    criteria: BuilderModel,
    label: string,
    criteriaSource: string | undefined
  ) => Promise<Criteria>;
}

export const CriteriaContext = createContext<CriteriaContextInterface>(
  {} as CriteriaContextInterface
);

interface CriteriaProviderProps {
  children: ReactNode;
}

export const CriteriaProvider: FC<CriteriaProviderProps> = memo(({ children }) => {
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const defaultCriteriaPath = `${config.get('demoCriteria')}default_criteria.json`;

  useEffect(() => {
    fetch(defaultCriteriaPath, {
      headers: {
        Accept: 'application/json'
      }
    })
      .then(response => response.json())
      .then(defaultCriteria => setCriteria(defaultCriteria));
  }, [defaultCriteriaPath]);

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
          if (file.name.endsWith('.cql')) {
            addCqlCriteria(rawContent);
          } else if (file.name.endsWith('.zip')) {
            const cqlLibraries: CqlLibraries = {};
            const zip = await JSZip.loadAsync(file);
            const zipFiles = Object.values(zip.files);
            // Check for criteria in each of the cql files, add cql to libraries if no criteria
            for (let i = 0; i < zipFiles.length; i++) {
              const zipFile = zipFiles[i];
              const zipFileName = zipFile.name;
              // Skip files that do not end with .cql, or other MacOS nonsense
              if (!zipFileName.endsWith('.cql') || zipFileName.startsWith('__MACOSX/')) continue;
              const fileContents = await zipFile.async('string');
              const libName = zipFile.name.slice(0, -4); // slice off the .cql extension
              cqlLibraries[libName] = { cql: fileContents };
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
    setCriteria(currentCriteria => currentCriteria.filter(c => c.id !== id));
  }, []);

  const addBuilderCriteria = useCallback(
    (
      buildCriteria: BuilderModel,
      label: string,
      criteriaSource: string | undefined
    ): Promise<Criteria> => {
      return builderModelToCriteria(buildCriteria, label).then(newCriteria => {
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

        return newCriteria;
      });
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
        addBuilderCriteria
      }}
    >
      {children}
    </CriteriaContext.Provider>
  );
});

export const useCriteriaContext = (): CriteriaContextInterface => useContext(CriteriaContext);
