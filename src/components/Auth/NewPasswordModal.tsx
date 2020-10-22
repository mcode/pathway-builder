import React, { FC, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faLock } from '@fortawesome/free-solid-svg-icons';
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

import styles from './Auth.module.scss';

interface newPassowrdModalProps {
  open: boolean;
  onClose: () => void;
  onPasswordReset: () => void;
}

const newPassowrdModal: FC<newPassowrdModalProps> = ({ open, onClose, onPasswordReset }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle disableTypography>
        <IconButton aria-label="close" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <label className={styles.modalHeader}>Reset Password</label>
        <label className={styles.modalText}>Enter your new password for your account</label>

        <OutlinedInput
          id="password"
          placeholder="Password"
          type="password"
          startAdornment={
            <InputAdornment position="start">
              <FontAwesomeIcon icon={faLock} />
            </InputAdornment>
          }
        />

        <OutlinedInput
          id="confirm-password"
          placeholder="Confirm Password"
          type="password"
          startAdornment={
            <InputAdornment position="start">
              <FontAwesomeIcon icon={faLock} />
            </InputAdornment>
          }
        />
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="secondary" type="submit" onClick={onPasswordReset}>
          RESET
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(newPassowrdModal);
