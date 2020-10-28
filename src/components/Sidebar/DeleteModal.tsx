import React, { FC, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@material-ui/core';

import useStyles from './styles';
import { useParams } from 'react-router-dom';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';

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
  const { pathway } = useCurrentPathwayContext();
  const { nodeId } = useParams();
  const currentNodeId = decodeURIComponent(nodeId);
  const currentNodeStatic = pathway?.nodes[currentNodeId];

  const text = isTransition ? (
    <span>
      Delete the transition from <strong>{currentNodeStatic?.label}</strong> to{' '}
      <strong>{nodeLabel}</strong>? This will not delete either node, just the transition between
      them.
    </span>
  ) : (
    <span>
      Delete the node <strong>{nodeLabel}</strong>? This will also remove any transitions to this
      node.
    </span>
  );

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
          <Button variant="contained" color="secondary" onClick={onDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default memo(DeleteModal);
