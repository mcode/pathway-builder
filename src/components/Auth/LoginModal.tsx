import React, { FC, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
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

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSignup: () => void;
  onReset: () => void;
}

const LoginModal: FC<LoginModalProps> = ({ open, onClose, onSignup, onReset }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle disableTypography>
        <IconButton aria-label="close" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <label className={styles.modalHeader}>Log in</label>
        <label className={styles.modalText}>
          Log in to access your account and manage your clinical pathways
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

        <OutlinedInput
          id="password"
          placeholder="Password"
          startAdornment={
            <InputAdornment position="start">
              <FontAwesomeIcon icon={faLock} />
            </InputAdornment>
          }
        />
        <span>
          <label>Forgot your password?</label>
          <Button variant="text"  color="primary" onClick={onReset}>
            Request a reset link.
          </Button>
        </span>
      </DialogContent>

      <DialogActions>
        <span>
          <label>Don't have an account?</label>
          <Button variant="text"  color="primary" onClick={onSignup}>
            Sign up.
          </Button>
        </span>
        <Button variant="contained" color="secondary" type="submit">
          LOG IN
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(LoginModal);
