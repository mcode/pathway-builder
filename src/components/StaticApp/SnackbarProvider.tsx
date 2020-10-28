import React, {
  FC,
  createContext,
  useState,
  memo,
  ReactNode,
  useContext,
  useCallback
} from 'react';

interface SnackbarContextInterface {
  snackbarText: string;
  openSnackbar: boolean;
  handleCloseSnackbar: () => void;
  setSnackbarText: (value: string) => void;
  setOpenSnackbar: (value: boolean) => void;
}

export const SnackbarContext = createContext<SnackbarContextInterface>(
  {} as SnackbarContextInterface
);

interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider: FC<SnackbarProviderProps> = memo(({ children }) => {
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarText, setSnackbarText] = useState<string>('Deleted Successfully');

  const handleCloseSnackbar = useCallback(() => {
    setOpenSnackbar(false);
  }, [setOpenSnackbar]);

  return (
    <SnackbarContext.Provider
      value={{ snackbarText, openSnackbar, handleCloseSnackbar, setSnackbarText, setOpenSnackbar }}
    >
      {children}
    </SnackbarContext.Provider>
  );
});

export const useSnackbarContext = (): SnackbarContextInterface => useContext(SnackbarContext);
