import React, { FC, useCallback, useRef, memo, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from '@material-ui/core';
import shortid from 'shortid';

import { usePathwayContext } from 'components/PathwayProvider';
import useStyles from './styles';
import { createNewPathway } from 'utils/builder';

interface NewPathwayModalProps {
  open: boolean;
  onClose: () => void;
}

const NewPathwayModal: FC<NewPathwayModalProps> = ({ open, onClose }) => {
  const styles = useStyles();
  const history = useHistory();
  const pathwayNameRef = useRef<HTMLInputElement>(null);
  const pathwayDescRef = useRef<HTMLInputElement>(null);
  const { addPathway } = usePathwayContext();

  const closeModal = useCallback(
    (pathwayId: string): void => {
      history.push(`/builder/${encodeURIComponent(pathwayId)}/node/Start`);
      onClose();
    },
    [history, onClose]
  );

  const handleCreateNewPathway = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      const pathwayId = shortid.generate();
      const name: string = pathwayNameRef.current?.value ?? '';
      const description: string = pathwayDescRef.current?.value ?? '';
      addPathway(createNewPathway(name, description, pathwayId));
      closeModal(pathwayId);
    },
    [addPathway, closeModal]
  );

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="create-pathway" fullWidth maxWidth="md">
      <DialogTitle disableTypography>
        <IconButton aria-label="close" onClick={onClose} className={styles.dialogCloseButton}>
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleCreateNewPathway}>
        <DialogContent>
          <TextField
            variant="outlined"
            autoFocus
            label="Pathway Name"
            fullWidth
            required
            inputRef={pathwayNameRef}
          />

          <TextField
            variant="outlined"
            label="Pathway Description"
            fullWidth
            inputRef={pathwayDescRef}
          />
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FontAwesomeIcon icon={faPlus} />}
            type="submit"
          >
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default memo(NewPathwayModal);
