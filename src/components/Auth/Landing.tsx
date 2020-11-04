import React, { FC, memo, useCallback, useState } from 'react';

import { LandingHeader, LandingBody, LandingFooter } from 'components/Auth';
import LoginModal from './LoginModal';
import ResetModal from './ResetModal';
import LinkSentModal from './LinkSentModal';
import NewPasswordModal from './NewPasswordModal';
import PasswordResetModal from './PasswordResetModal';
import SignupModal from './SignupModal';
import useStyles from './styles';

const Landing: FC = () => {
  const styles = useStyles();

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
    <div className={styles.landing}>
      <LandingHeader openLogin={openLoginModal} openSignup={openSignupModal} />
      <LandingBody />
      <LandingFooter />

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
    </div>
  );
};

export default memo(Landing);
