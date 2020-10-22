import React, { FC, memo, useCallback, useState, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { useCurrentCriteriaContext } from 'components/CurrentCriteriaProvider';
import { useThemeToggle } from '../ThemeProvider';
import SignupModal from './SignupModal';
import LoginModal from './LoginModal';
import ResetModal from './ResetModal';

import logo from 'camino-builder-logo-light-bg.png';
import styles from './Auth.module.scss';

const AuthHeader: FC = () => {
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

  const switchToLogin = useCallback((): void => {
    setOpenSignup(false);
    setOpenReset(false);
    setOpenLogin(true);
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
      <button onClick={openLoginModal} aria-controls="options-menu" aria-haspopup="true">
        LOGIN
      </button>
      <LoginModal
        open={openLogin}
        onClose={closeLoginModal}
        onSignup={switchToSignup}
        onReset={switchToReset}
      />
      <SignupModal open={openSignup} onClose={closeSingupModal} onLogin={switchToLogin} />
      <ResetModal open={openReset} onClose={closeResetModal} onLogin={switchToLogin} />
    </header>
  );
};

export default memo(AuthHeader);
