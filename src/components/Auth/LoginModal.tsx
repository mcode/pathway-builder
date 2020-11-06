import React, { FC, memo, useCallback } from 'react';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@material-ui/core';

import Modal from 'components/elements/Modal';
import TextInput from 'components/elements/TextInput';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSignup: () => void;
  onReset: () => void;
}

const LoginModal: FC<LoginModalProps> = ({ open, onClose, onSignup, onReset }) => {
  const logIn = useCallback((): void => {
    return; // TODO
  }, []);

  const signUp = (
    <>
      Don't have an account?{' '}
      <Button variant="text" color="primary" onClick={onSignup}>
        Sign up.
      </Button>
    </>
  );

  const requestReset = (
    <>
      <label>Forgot your password?</label>
      <Button variant="text" color="primary" onClick={onReset}>
        Request a reset link.
      </Button>
    </>
  );

  return (
    <Modal
      handleShowModal={open}
      handleCloseModal={onClose}
      handleSaveModal={logIn}
      headerTitle="Log in"
      headerSubtitle="Log in to access your account and manage your clinical pathways"
      footerText={signUp}
      submitButtonText="Log in"
    >
      <>
        <TextInput id="email" placeholder="Email" type="email" icon={faEnvelope} />
        <TextInput
          id="password"
          placeholder="Password"
          type="password"
          icon={faLock}
          helperText={requestReset}
        />
      </>
    </Modal>
  );
};

export default memo(LoginModal);
