import React, { FC, memo } from 'react';

import Modal from 'components/elements/Modal';

interface LinkSentModalProps {
  open: boolean;
  onClose: () => void;
}

const LinkSentModal: FC<LinkSentModalProps> = ({ open, onClose }) => {
  return (
    <Modal
      handleShowModal={open}
      handleCloseModal={onClose}
      handleSaveModal={onClose}
      headerTitle="Link sent"
      headerSubtitle="A password reset link was successfully sent. Please check your email to set your new password."
      submitButtonText="Close"
    />
  );
};

export default memo(LinkSentModal);
