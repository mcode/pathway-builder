import React, { createContext, ReactNode, FC, useState, memo, useContext } from 'react';

interface CriteriaContextInterface {
  criteria: string[];
  setCriteria: (criteria: string[]) => void;
}

export const CriteriaContext = createContext<CriteriaContextInterface>(
  {} as CriteriaContextInterface
);

interface CriteriaProviderProps {
  children: ReactNode;
}

export const CriteriaProvider: FC<CriteriaProviderProps> = memo(({ children }) => {
  const [criteria, setCriteria] = useState<string[]>([]);

  return (
    <CriteriaContext.Provider value={{ criteria, setCriteria }}>
      {children}
    </CriteriaContext.Provider>
  );
});

export const useCriteriaContext = (): CriteriaContextInterface => useContext(CriteriaContext);
