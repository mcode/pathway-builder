import React, { FC, memo, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';

import { useCurrentCriteriaContext } from 'components/CurrentCriteriaProvider';
import SignupModal from './SignupModal';
import LoginModal from './LoginModal';
import ResetModal from './ResetModal';
import LinkSentModal from './LinkSentModal';
import NewPasswordModal from './NewPasswordModal';
import PasswordResetModal from './PasswordResetModal';

import logo from 'camino-builder-logo-light-bg.png';
import useStyles from './styles';

const AuthHeader: FC = () => {
  const styles = useStyles();

  const [openLogin, setOpenLogin] = useState<boolean>(false);
  const { resetCurrentCriteria } = useCurrentCriteriaContext();
  const openLoginModal = useCallback((): void => {
    setOpenLogin(true);
  }, []);

  const closeLoginModal = useCallback((): void => {
    setOpenLogin(false);
  }, []);

  const [openSignup, setOpenSignup] = useState<boolean>(false);
  const openSignupModal = useCallback((): void => {
    setOpenSignup(true);
  }, []);

  const closeSingupModal = useCallback((): void => {
    setOpenSignup(false);
  }, []);

  const [openReset, setOpenReset] = useState<boolean>(false);
  const openResetModal = useCallback((): void => {
    setOpenReset(true);
  }, []);

  const closeResetModal = useCallback((): void => {
    setOpenReset(false);
  }, []);

  const [openLinkSent, setOpenLinkSent] = useState<boolean>(false);
  const openLinkSentModal = useCallback((): void => {
    setOpenLinkSent(true);
  }, []);

  const closeLinkSentModal = useCallback((): void => {
    setOpenLinkSent(false);
  }, []);

  const [openNewPassword, setOpenNewPassword] = useState<boolean>(false);
  const openNewPasswordModal = useCallback((): void => {
    setOpenNewPassword(true);
  }, []);

  const closeNewPasswordModal = useCallback((): void => {
    setOpenNewPassword(false);
  }, []);

  const [openPasswordReset, setOpenPasswordReset] = useState<boolean>(false);
  const openPasswordResetModal = useCallback((): void => {
    setOpenPasswordReset(true);
  }, []);

  const closePasswordResetModal = useCallback((): void => {
    setOpenPasswordReset(false);
  }, []);

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

  // remove this - just setup to show the new modal
  const removeThis = useCallback((): void => {
    setOpenLinkSent(false);
    setOpenLogin(false);
    setOpenReset(false);
    setOpenSignup(false);
    setOpenPasswordReset(false);
    setOpenNewPassword(true);
  }, []);

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.homeLink} onClick={(): void => resetCurrentCriteria()}>
        <img src={logo} alt="logo" className={styles.logo} />
      </Link>
      <button
        className={styles.signupButton}
        onClick={openSignupModal}
        aria-controls="options-menu"
        aria-haspopup="true"
      >
        SIGN UP
      </button>
      <button
        className={styles.loginButton}
        onClick={openLoginModal}
        aria-controls="options-menu"
        aria-haspopup="true"
      >
        LOGIN
      </button>

      <LoginModal
        open={openLogin}
        onClose={closeLoginModal}
        onSignup={switchToSignup}
        onReset={switchToReset}
      />
      <SignupModal open={openSignup} onClose={closeSingupModal} onLogin={switchToLogin} />
      <ResetModal
        open={openReset}
        onClose={closeResetModal}
        onLogin={switchToLogin}
        onLinkSent={switchToLinkSent}
      />
      {/* Use commented out version once modals have been reviewed */}
      {/* <LinkSentModal open={openLinkSent} onClose={closeLinkSentModal} /> */}
      <LinkSentModal open={openLinkSent} onClose={closeLinkSentModal} onRemoveMe={removeThis} />
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
    </header>
  );
};

export default memo(AuthHeader);
