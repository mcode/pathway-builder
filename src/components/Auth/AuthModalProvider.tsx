import React, {
  createContext,
  FC,
  memo,
  ReactNode,
  useCallback,
  useContext,
  useState
} from 'react';

import LoginModal from './LoginModal';
import ResetModal from './ResetModal';
import LinkSentModal from './LinkSentModal';
import NewPasswordModal from './NewPasswordModal';
import PasswordResetModal from './PasswordResetModal';
import SignupModal from './SignupModal';

interface AuthModalsProps {
  openLogin: boolean;
  openSignup: boolean;
  openReset: boolean;
  openLinkSent: boolean;
  openNewPassword: boolean;
  openPasswordReset: boolean;
  switchToLogin: () => void;
  switchToReset: () => void;
  switchToSignup: () => void;
  switchToLinkSent: () => void;
  switchToPasswordReset: () => void;
  closeLoginModal: () => void;
  closeSignupModal: () => void;
  closeResetModal: () => void;
  closeLinkSentModal: () => void;
  closeNewPasswordModal: () => void;
  closePasswordResetModal: () => void;
}

const AuthModals: FC<AuthModalsProps> = ({
  openLogin,
  openSignup,
  openReset,
  openLinkSent,
  openNewPassword,
  openPasswordReset,
  switchToLogin,
  switchToReset,
  switchToSignup,
  switchToLinkSent,
  switchToPasswordReset,
  closeLoginModal,
  closeSignupModal,
  closeResetModal,
  closeLinkSentModal,
  closeNewPasswordModal,
  closePasswordResetModal
}) => {
  return (
    <>
      <LoginModal
        open={openLogin}
        onClose={closeLoginModal}
        onSignup={switchToSignup}
        onReset={switchToReset}
      />

      <SignupModal open={openSignup} onClose={closeSignupModal} onLogin={switchToLogin} />

      <ResetModal
        open={openReset}
        onClose={closeResetModal}
        onLogin={switchToLogin}
        onLinkSent={switchToLinkSent}
      />

      <LinkSentModal open={openLinkSent} onClose={closeLinkSentModal} />

      <NewPasswordModal
        open={openNewPassword}
        onClose={closeNewPasswordModal}
        onPasswordReset={switchToPasswordReset}
      />

      <PasswordResetModal
        open={openPasswordReset}
        onClose={closePasswordResetModal}
        onLogin={switchToLogin}
      />
    </>
  );
};

interface AuthModalContextInterface {
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openSignupModal: () => void;
  closeSignupModal: () => void;
}

export const AuthModalContext = createContext<AuthModalContextInterface>(
  {} as AuthModalContextInterface
);

interface AuthModalProviderProps {
  children: ReactNode;
}

export const AuthModalProvider: FC<AuthModalProviderProps> = memo(({ children }) => {
  const [openLogin, setOpenLogin] = useState<boolean>(false);
  const [openSignup, setOpenSignup] = useState<boolean>(false);
  const [openReset, setOpenReset] = useState<boolean>(false);
  const [openLinkSent, setOpenLinkSent] = useState<boolean>(false);
  const [openNewPassword, setOpenNewPassword] = useState<boolean>(false);
  const [openPasswordReset, setOpenPasswordReset] = useState<boolean>(false);

  const switchToLogin = useCallback((): void => {
    setOpenSignup(false);
    setOpenReset(false);
    setOpenLogin(true);
    setOpenPasswordReset(false);
  }, []);

  const switchToReset = useCallback((): void => {
    setOpenSignup(false);
    setOpenLogin(false);
    setOpenReset(true);
  }, []);

  const switchToSignup = useCallback((): void => {
    setOpenLogin(false);
    setOpenReset(false);
    setOpenSignup(true);
  }, []);

  const switchToLinkSent = useCallback((): void => {
    setOpenReset(false);
    setOpenLinkSent(true);
  }, []);

  const switchToPasswordReset = useCallback((): void => {
    setOpenPasswordReset(true);
    setOpenNewPassword(false);
  }, []);

  const openLoginModal = useCallback((): void => {
    setOpenLogin(true);
  }, []);

  const closeLoginModal = useCallback((): void => {
    setOpenLogin(false);
  }, []);

  const openSignupModal = useCallback((): void => {
    setOpenSignup(true);
  }, []);

  const closeSignupModal = useCallback((): void => {
    setOpenSignup(false);
  }, []);

  const closeResetModal = useCallback((): void => {
    setOpenReset(false);
  }, []);

  const closeLinkSentModal = useCallback((): void => {
    setOpenLinkSent(false);
  }, []);

  const closeNewPasswordModal = useCallback((): void => {
    setOpenNewPassword(false);
  }, []);

  const closePasswordResetModal = useCallback((): void => {
    setOpenPasswordReset(false);
  }, []);

  return (
    <AuthModalContext.Provider
      value={{ openLoginModal, closeLoginModal, openSignupModal, closeSignupModal }}
    >
      <AuthModals
        openLogin={openLogin}
        openSignup={openSignup}
        openReset={openReset}
        openLinkSent={openLinkSent}
        openNewPassword={openNewPassword}
        openPasswordReset={openPasswordReset}
        switchToLogin={switchToLogin}
        switchToReset={switchToReset}
        switchToSignup={switchToSignup}
        switchToLinkSent={switchToLinkSent}
        switchToPasswordReset={switchToPasswordReset}
        closeLoginModal={closeLoginModal}
        closeSignupModal={closeSignupModal}
        closeResetModal={closeResetModal}
        closeLinkSentModal={closeLinkSentModal}
        closeNewPasswordModal={closeNewPasswordModal}
        closePasswordResetModal={closePasswordResetModal}
      />
      {children}
    </AuthModalContext.Provider>
  );
});

export const useAuthModalContext = (): AuthModalContextInterface => useContext(AuthModalContext);
