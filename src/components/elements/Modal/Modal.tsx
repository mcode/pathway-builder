import React, { FC, memo, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@material-ui/core';

import useStyles from './styles';

interface ModalProps {
  handleShowModal: boolean;
  handleCloseModal: () => void;
  handleSaveModal: () => void;
  headerTitle: string;
  headerSubtitle: string;
  footerText?: ReactNode;
  hasSecondaryButton?: boolean;
  submitButtonText: string;
  children?: ReactNode;
}

const Modal: FC<ModalProps> = ({
  handleShowModal,
  handleCloseModal,
  handleSaveModal,
  headerTitle,
  headerSubtitle,
  footerText = '',
  hasSecondaryButton = false,
  submitButtonText,
  children
}) => {
  const styles = useStyles();

  return (
    <Dialog open={handleShowModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
      <DialogTitle disableTypography>
        <IconButton aria-label="close" onClick={handleCloseModal} className={styles.closeIcon}>
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <div className={styles.modalHeader}>{headerTitle}</div>
        <div className={styles.modalText}>{headerSubtitle}</div>

        {children && children}
      </DialogContent>

      <DialogActions>
        <div>{footerText}</div>

        {hasSecondaryButton && (
          <Button variant="contained" onClick={handleCloseModal}>
            Cancel
          </Button>
        )}

        <Button
          variant="contained"
          color="secondary"
          type="submit"
          onClick={handleSaveModal}
          className={styles.submitButton}
        >
          {submitButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(Modal);
