import React, {
  createContext,
  useCallback,
  useState,
  memo,
  ReactNode,
  FC,
  useContext
} from 'react';

interface CriteriaBuilderContextInterface {
  selectedElement: string;
  selectedDemoElement: string;
  gender: string;
  minimumAge: number;
  maximumAge: number;
  setSelectedElement: (selectedElement: string) => void;
  setSelectedDemoElement: (selectedDemoElement: string) => void;
  setGender: (gender: string) => void;
  setMinimumAge: (age: number) => void;
  setMaximumAge: (age: number) => void;
  resetCriteriaBuilder: () => void;
}

export const CriteriaBuilderContext = createContext<CriteriaBuilderContextInterface>(
  {} as CriteriaBuilderContextInterface
);

interface CriteriaBuilderProviderProps {
  children: ReactNode;
}

export const CriteriaBuilderProvider: FC<CriteriaBuilderProviderProps> = memo(({ children }) => {
  const [selectedElement, setSelectedElement] = useState<string>('');
  const [selectedDemoElement, setSelectedDemoElement] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [minimumAge, setMinimumAge] = useState<number>(0);
  const [maximumAge, setMaximumAge] = useState<number>(0);

  const resetCriteriaBuilder = useCallback(() => {
    setSelectedElement('');
    setSelectedDemoElement('');
    setGender('');
    setMinimumAge(0);
    setMaximumAge(0);
  }, [setSelectedElement, setSelectedDemoElement, setGender, setMinimumAge, setMaximumAge]);

  return (
    <CriteriaBuilderContext.Provider
      value={{
        selectedElement,
        selectedDemoElement,
        gender,
        minimumAge,
        maximumAge,
        setSelectedElement,
        setSelectedDemoElement,
        setGender,
        setMinimumAge,
        setMaximumAge,
        resetCriteriaBuilder
      }}
    >
      {children}
    </CriteriaBuilderContext.Provider>
  );
});

export const useCriteriaBuilderContext = (): CriteriaBuilderContextInterface =>
  useContext(CriteriaBuilderContext);
