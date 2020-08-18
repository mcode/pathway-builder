import React, {
  createContext,
  useCallback,
  useState,
  memo,
  ReactNode,
  FC,
  useContext
} from 'react';

interface CriteriaBuilderStateContextInterface {
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
  resetCriteriaBuilderState: () => void;
}

export const CriteriaBuilderStateContext = createContext<CriteriaBuilderStateContextInterface>(
  {} as CriteriaBuilderStateContextInterface
);

interface CriteriaBuilderStateProviderProps {
  children: ReactNode;
}

export const CriteriaBuilderStateProvider: FC<CriteriaBuilderStateProviderProps> = memo(
  ({ children }) => {
    const [selectedElement, setSelectedElement] = useState<string>('');
    const [selectedDemoElement, setSelectedDemoElement] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [minimumAge, setMinimumAge] = useState<number>(0);
    const [maximumAge, setMaximumAge] = useState<number>(0);

    const resetCriteriaBuilderState = useCallback(() => {
      setSelectedElement('');
      setSelectedDemoElement('');
      setGender('');
      setMinimumAge(0);
      setMaximumAge(0);
    }, [setSelectedElement, setSelectedDemoElement, setGender, setMinimumAge, setMaximumAge]);

    return (
      <CriteriaBuilderStateContext.Provider
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
          resetCriteriaBuilderState
        }}
      >
        {children}
      </CriteriaBuilderStateContext.Provider>
    );
  }
);

export const useCriteriaBuilderStateContext = (): CriteriaBuilderStateContextInterface =>
  useContext(CriteriaBuilderStateContext);
