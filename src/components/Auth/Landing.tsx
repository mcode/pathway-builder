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

  const toggleModal = useCallback((modalType, open): void => {
    switch (modalType) {
      case 'login':
        setOpenLogin(open);
        break;
      case 'signup':
        setOpenSignup(open);
        break;
      case 'reset':
        setOpenReset(open);
        break;
      case 'linkSent':
        setOpenLinkSent(open);
        break;
      case 'newPassword':
        setOpenNewPassword(open);
        break;
      case 'passwordReset':
        setOpenPasswordReset(open);
        break;
      default:
        break;
    }
  }, []);

  const switchToLogin = useCallback((): void => {
    toggleModal('signup', false);
    toggleModal('reset', false);
    toggleModal('login', true);
    toggleModal('passwordReset', false);
  }, [toggleModal]);

  const switchToReset = useCallback((): void => {
    toggleModal('signup', false);
    toggleModal('login', false);
    toggleModal('reset', true);
  }, [toggleModal]);

  const switchToSignup = useCallback((): void => {
    toggleModal('login', false);
    toggleModal('reset', false);
    toggleModal('signup', true);
  }, [toggleModal]);

  const switchToLinkSent = useCallback((): void => {
    toggleModal('reset', false);
    toggleModal('linkSent', true);
  }, [toggleModal]);

  const switchToPasswordReset = useCallback((): void => {
    toggleModal('passwordReset', true);
    toggleModal('newPassword', false);
  }, [toggleModal]);

  // TODO: remove this - just setup to show the new modal
  const removeThis = useCallback((): void => {
    toggleModal('linkSent', false);
    toggleModal('login', false);
    toggleModal('reset', false);
    toggleModal('signup', false);
    toggleModal('passwordReset', false);
    toggleModal('newPassword', true);
  }, [toggleModal]);

  return (
    <div className={styles.landing}>
      <LandingHeader
        openLogin={(): void => toggleModal('login', true)}
        openSignup={(): void => toggleModal('signup', true)}
      />

      <LandingBody />
      <LandingFooter />

      <LoginModal
        open={openLogin}
        onClose={(): void => toggleModal('login', false)}
        onSignup={switchToSignup}
        onReset={switchToReset}
      />

      <SignupModal
        open={openSignup}
        onClose={(): void => toggleModal('signup', false)}
        onLogin={switchToLogin}
      />

      <ResetModal
        open={openReset}
        onClose={(): void => toggleModal('reset', false)}
        onLogin={switchToLogin}
        onLinkSent={switchToLinkSent}
      />

      {/* Use commented out version once modals have been reviewed */}
      {/* <LinkSentModal open={openLinkSent} onClose={closeLinkSentModal} /> */}
      <LinkSentModal
        open={openLinkSent}
        onClose={(): void => toggleModal('linkSent', false)}
        onRemoveMe={removeThis}
      />

      <NewPasswordModal
        open={openNewPassword}
        onClose={(): void => toggleModal('newPassword', false)}
        onPasswordReset={switchToPasswordReset}
      />

      <PasswordResetModal
        open={openPasswordReset}
        onClose={(): void => toggleModal('passwordReset', false)}
        onLogin={switchToLogin}
      />
    </div>
  );
};

export default memo(Landing);
