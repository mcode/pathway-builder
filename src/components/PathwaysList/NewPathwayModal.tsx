import React, { FC, useCallback, useRef, memo, FormEvent } from 'react';
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
import { v4 as uuidv4 } from 'uuid';

import { usePathwayContext } from '../PathwayProvider';
import useStyles from './styles';

interface NewPathwayModalProps {
  open: boolean;
  onClose: () => void;
}

const NewPathwayModal: FC<NewPathwayModalProps> = ({ open, onClose }) => {
  const styles = useStyles();
  const pathwayNameRef = useRef<HTMLInputElement>(null);
  const pathwayDescRef = useRef<HTMLInputElement>(null);
  const { addPathway } = usePathwayContext();

  const createNewPathway = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();

      addPathway({
        id: uuidv4(),
        name: pathwayNameRef.current?.value ?? '',
        description: pathwayDescRef.current?.value ?? '',
        library: '',
        criteria: [],
        states: {
          Start: {
            label: 'Start',
            transitions: []
          }
        }
      });
      onClose();
    },
    [addPathway, onClose]
  );

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="create-pathway" fullWidth maxWidth="md">
      <DialogTitle disableTypography>
        <IconButton aria-label="close" onClick={onClose} className={styles.dialogCloseButton}>
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={createNewPathway}>
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
