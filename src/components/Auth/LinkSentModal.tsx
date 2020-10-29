import React, { FC, memo } from 'react';

import Modal from '../elements/Modal';

interface LinkSentModalProps {
  open: boolean;
  onClose: () => void;
  onRemoveMe: () => void; // TODO: remove after testing
}

const LinkSentModal: FC<LinkSentModalProps> = ({ open, onClose, onRemoveMe }) => {
  return (
    <Modal
      handleShowModal={open}
      handleCloseModal={onClose}
      handleSaveModal={onRemoveMe} // TODO: change to onClose once tested
      headerTitle="Link sent"
      headerSubtitle="A password reset link was successfully sent. Please check your email to set your new password."
      submitButtonText="Close"
    />
  );
};

export default memo(LinkSentModal);
