import React, { FC, memo } from 'react';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@material-ui/core';

import Modal from 'components/elements/Modal';
import TextInput from 'components/elements/TextInput';

interface ResetModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
  onLinkSent: () => void;
}

const ResetModal: FC<ResetModalProps> = ({ open, onClose, onLogin, onLinkSent }) => {
  const logIn = (
    <>
      Already know your password?{' '}
      <Button variant="text" color="primary" onClick={onLogin}>
        Log in.
      </Button>
    </>
  );

  return (
    <Modal
      handleShowModal={open}
      handleCloseModal={onClose}
      handleSaveModal={onLinkSent}
      headerTitle="Reset password"
      headerSubtitle="Enter your email address you're using for your account below and we'll send you a password reset link"
      footerText={logIn}
      submitButtonText="Reset"
    >
      <>
        <TextInput id="email" placeholder="Email" type="email" icon={faEnvelope} />
      </>
    </Modal>
  );
};

export default memo(ResetModal);
