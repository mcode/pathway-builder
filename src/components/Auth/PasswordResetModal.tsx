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

interface PasswordResetModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const PasswordResetModal: FC<PasswordResetModalProps> = ({ open, onClose, onLogin }) => {
  const styles = useStyles();
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle disableTypography>
        <IconButton aria-label="close" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <label className={styles.modalHeader}>Password Reset</label>
        <label className={styles.modalText}>
          Your password was successfully reset! You can now use your new password to log in.
        </label>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="secondary" type="submit" onClick={onLogin}>
          LOG IN
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(PasswordResetModal);
