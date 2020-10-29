import React, { FC, memo, useCallback } from 'react';
import { faEnvelope, faBuilding, faLock } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@material-ui/core';

import Modal from '../elements/Modal';
import TextInput from '../elements/TextInput';

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const SignupModal: FC<SignupModalProps> = ({ open, onClose, onLogin }) => {
  const signUp = useCallback((): void => {
    return; // TODO
  }, []);

  const logIn = (
    <>
      Already signed up?{' '}
      <Button variant="text" color="primary" onClick={onLogin}>
        Log in.
      </Button>
    </>
  );

  return (
    <Modal
      handleShowModal={open}
      handleCloseModal={onClose}
      handleSaveModal={signUp}
      headerTitle="Sign up"
      headerSubtitle="Create an account to start building your own clinical pathways"
      footerText={logIn}
      submitButtonText="Sign up"
    >
      <>
        <TextInput id="email" placeholder="Email" type="email" icon={faEnvelope} />
        <TextInput id="organization" placeholder="Organization (optional)" icon={faBuilding} />
        <TextInput id="password" placeholder="Password" type="password" icon={faLock} />

        <TextInput
          id="confirm-password"
          placeholder="Confirm Password"
          type="password"
          icon={faLock}
        />
      </>
    </Modal>
  );
};

export default memo(SignupModal);
