import React, { FC, memo } from 'react';
import { faLock } from '@fortawesome/free-solid-svg-icons';

import Modal from 'components/elements/Modal';
import TextInput from 'components/elements/TextInput';

interface NewPasswordModalProps {
  open: boolean;
  onClose: () => void;
  onPasswordReset: () => void;
}

const NewPasswordModal: FC<NewPasswordModalProps> = ({ open, onClose, onPasswordReset }) => {
  return (
    <Modal
      handleShowModal={open}
      handleCloseModal={onClose}
      handleSaveModal={onPasswordReset}
      headerTitle="Reset password"
      headerSubtitle="Enter your new password for your account"
      submitButtonText="Reset"
    >
      <>
        <TextInput id="password" placeholder="Password" type="password" icon={faLock} />

        <TextInput
          id="confirm-password"
          placeholder="Confirm password"
          type="password"
          icon={faLock}
        />
      </>
    </Modal>
  );
};

export default memo(NewPasswordModal);
