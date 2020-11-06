import React, {
  FC,
  createContext,
  useState,
  memo,
  ReactNode,
  useContext,
  useCallback
} from 'react';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

interface BackendAlertProps {
  message: string;
  open: boolean;
  closeAlert: () => void;
}

const BackendAlert: FC<BackendAlertProps> = ({ message, open, closeAlert }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={closeAlert}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <MuiAlert elevation={6} variant="filled" onClose={closeAlert} severity="error">
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

interface AlertContextInterface {
  setAlertText: (value: string) => void;
  setOpenAlert: (value: boolean) => void;
}

export const AlertContext = createContext<AlertContextInterface>({} as AlertContextInterface);

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: FC<AlertProviderProps> = memo(({ children }) => {
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>(
    'An error occured. Please save your work and restart the app.'
  );

  const handleCloseAlert = useCallback(() => {
    setOpenAlert(false);
  }, [setOpenAlert]);

  return (
    <AlertContext.Provider value={{ setAlertText, setOpenAlert }}>
      <BackendAlert message={alertText} open={openAlert} closeAlert={handleCloseAlert} />
      {children}
    </AlertContext.Provider>
  );
});

export const useAlertContext = (): AlertContextInterface => useContext(AlertContext);
