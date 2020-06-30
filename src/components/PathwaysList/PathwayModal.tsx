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
import { Pathway } from 'pathways-model';

interface PathwayModalProps {
  open: boolean;
  onClose: () => void;
  editPath?: Pathway;
}

const PathwayModal: FC<PathwayModalProps> = ({ open, onClose, editPath }) => {
  const createNewModal = !editPath;
  const styles = useStyles();
  const history = useHistory();
  const pathwayNameRef = useRef<HTMLInputElement>(null);
  const pathwayDescRef = useRef<HTMLInputElement>(null);
  const { addPathway, updatePathwayAtIndex, pathways } = usePathwayContext();

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

  const handleUpdatePathway = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      if (editPath) {
        if (pathwayNameRef.current?.value) editPath.name = pathwayNameRef.current?.value;
        if (pathwayDescRef.current?.value !== '')
          editPath.description = pathwayDescRef.current?.value;
        const pathwayId = editPath.id;
        const pathwayIndex = pathways.findIndex(pathway => pathway.id === pathwayId);
        updatePathwayAtIndex(editPath, pathwayIndex);
        onClose();
      }
    },
    [pathways, updatePathwayAtIndex, editPath, onClose]
  );

  let label = 'Pathway Name';
  let description = 'Pathway Description';
  if (editPath) {
    label = editPath.name;
    const metaDescription = editPath.description;
    if (metaDescription && metaDescription !== '') description = metaDescription;
  }

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="create-pathway" fullWidth maxWidth="md">
      <DialogTitle disableTypography>
        <IconButton aria-label="close" onClick={onClose} className={styles.dialogCloseButton}>
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={createNewModal ? handleCreateNewPathway : handleUpdatePathway}>
        <DialogContent>
          <TextField
            variant="outlined"
            autoFocus
            label={label}
            fullWidth
            required={createNewModal}
            inputRef={pathwayNameRef}
          />

          <TextField variant="outlined" label={description} fullWidth inputRef={pathwayDescRef} />
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FontAwesomeIcon icon={faPlus} />}
            type="submit"
          >
            {createNewModal ? 'Create' : 'Update Info'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default memo(PathwayModal);
