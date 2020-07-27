import React, { FC, memo, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar
} from '@material-ui/core';

import useStyles from './styles';

interface DeleteModalProps {
  open: boolean;
  nodeLabel: string;
  isTransition: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteModal: FC<DeleteModalProps> = ({
  open,
  nodeLabel,
  isTransition,
  onClose,
  onDelete
}) => {
  const styles = useStyles();
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const handleDelete = useCallback((): void => {
    setOpenSnackbar(true);
    onDelete();
  }, [onDelete]);

  const handleCloseSnackbar = useCallback((): void => {
    setOpenSnackbar(false);
  }, []);

  const text = isTransition ? (
    <span>
      Delete the transition from <strong>{nodeLabel}</strong>? This will not delete either node,
      just the transition between them.
    </span>
  ) : (
    <span>
      Delete the node <strong>{nodeLabel}</strong>? This will also remove any transitions to this
      node.
    </span>
  );

  const snackbarMessage = isTransition
    ? 'Transition deleted successfully'
    : 'Node deleted successfully';

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="create-pathway"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle disableTypography>
          <IconButton aria-label="close" onClick={onClose} className={styles.dialogCloseButton}>
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </DialogTitle>

        <DialogContent className={styles.dialogContent}>
          <FontAwesomeIcon icon={faExclamationCircle} className={styles.alertIcon} />
          <p className={styles.dialogContentText}>{text}</p>
        </DialogContent>

        <DialogActions>
          <Button variant="text" color="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="secondary" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <React.Fragment>
            <Button color="secondary" size="small" onClick={handleCloseSnackbar}>
              UNDO
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackbar}
            >
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </React.Fragment>
        }
      />
    </>
  );
};

export default memo(DeleteModal);
