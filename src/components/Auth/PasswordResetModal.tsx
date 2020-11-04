import React, { FC, memo } from 'react';

import Modal from 'components/elements/Modal';

interface PasswordResetModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const PasswordResetModal: FC<PasswordResetModalProps> = ({ open, onClose, onLogin }) => {
  return (
    <Modal
      handleShowModal={open}
      handleCloseModal={onClose}
      handleSaveModal={onLogin}
      headerTitle="Password reset"
      headerSubtitle="Your password was successfully reset! You can now use your new password to log in."
      submitButtonText="Log in"
    />
  );
};

export default memo(PasswordResetModal);
