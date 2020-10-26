import React, { FC, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  OutlinedInput
} from '@material-ui/core';

import useStyles from './styles';

interface ResetModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
  onLinkSent: () => void;
}

const ResetModal: FC<ResetModalProps> = ({ open, onClose, onLogin, onLinkSent }) => {
  const styles = useStyles();
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle disableTypography>
        <IconButton aria-label="close" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <label className={styles.modalHeader}>Reset Password</label>
        <label className={styles.modalText}>
          Enter your email address you're using for your account below and we'll send you a password
          reset link
        </label>

        <OutlinedInput
          id="email"
          placeholder="Email"
          startAdornment={
            <InputAdornment position="start">
              <FontAwesomeIcon icon={faEnvelope} />
            </InputAdornment>
          }
        />
      </DialogContent>

      <DialogActions>
        <span>
          <label>Already know your password?</label>
          <Button variant="text" color="primary" onClick={onLogin}>
            Log in.
          </Button>
        </span>
        <Button variant="contained" color="secondary" type="submit" onClick={onLinkSent}>
          REQUEST
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(ResetModal);
