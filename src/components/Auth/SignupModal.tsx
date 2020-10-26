import React, { FC, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEnvelope, faBuilding, faLock } from '@fortawesome/free-solid-svg-icons';
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

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const SignupModal: FC<SignupModalProps> = ({ open, onClose, onLogin }) => {
  const styles = useStyles();
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle disableTypography>
        <IconButton aria-label="close" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <label className={styles.modalHeader}>Sign up</label>
        <label className={styles.modalText}>
          Create an account to start building your own clinical pathways
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
          id="organization"
          placeholder="Organization (optional)"
          startAdornment={
            <InputAdornment position="start">
              <FontAwesomeIcon icon={faBuilding} />
            </InputAdornment>
          }
        />

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
        <span>
          <label>Already signed up?</label>
          <Button variant="text" color="primary" onClick={onLogin}>
            Login.
          </Button>
        </span>
        <Button variant="contained" color="secondary" type="submit">
          SIGN UP
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(SignupModal);
