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

  // TODO: remove this - just setup to show the new modal
  const removeThis = useCallback((): void => {
    setOpenLinkSent(false);
    setOpenLogin(false);
    setOpenReset(false);
    setOpenSignup(false);
    setOpenPasswordReset(false);
    setOpenNewPassword(true);
  }, []);

  return (
    <div className={styles.landing}>
      <LandingHeader
        openLogin={(): void => setOpenLogin(true)}
        openSignup={(): void => setOpenSignup(true)}
      />

      <LandingBody />
      <LandingFooter />

      <LoginModal
        open={openLogin}
        onClose={(): void => setOpenLogin(false)}
        onSignup={switchToSignup}
        onReset={switchToReset}
      />

      <SignupModal
        open={openSignup}
        onClose={(): void => setOpenSignup(false)}
        onLogin={switchToLogin}
      />

      <ResetModal
        open={openReset}
        onClose={(): void => setOpenReset(false)}
        onLogin={switchToLogin}
        onLinkSent={switchToLinkSent}
      />

      {/* Use commented out version once modals have been reviewed */}
      {/* <LinkSentModal open={openLinkSent} onClose={closeLinkSentModal} /> */}
      <LinkSentModal
        open={openLinkSent}
        onClose={(): void => setOpenLinkSent(false)}
        onRemoveMe={removeThis}
      />

      <NewPasswordModal
        open={openNewPassword}
        onClose={(): void => setOpenNewPassword(false)}
        onPasswordReset={switchToPasswordReset}
      />

      <PasswordResetModal
        open={openPasswordReset}
        onClose={(): void => setOpenPasswordReset(false)}
        onLogin={switchToLogin}
      />
    </div>
  );
};

export default memo(Landing);
