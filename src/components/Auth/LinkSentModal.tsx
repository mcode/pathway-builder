import React, { FC, memo } from 'react';
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

interface LinkSentModalProps {
  open: boolean;
  onClose: () => void;
  // remove onRemoveMe after review
  onRemoveMe: () => void;
}

const LinkSentModal: FC<LinkSentModalProps> = ({ open, onClose, onRemoveMe }) => {
  const styles = useStyles();
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle disableTypography>
        <IconButton aria-label="close" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <label className={styles.modalHeader}>Link Sent</label>
        <label className={styles.modalText}>
          A password reset link was successfully sent. Please check your email to set your new
          password.
        </label>
      </DialogContent>

      <DialogActions>
        {/* Use commented out version once modals have been reviewed */}
        {/* <Button variant="contained" color="secondary" type="submit" onClick={onClose}> */}
        <Button variant="contained" color="secondary" type="submit" onClick={onRemoveMe}>
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(LinkSentModal);
