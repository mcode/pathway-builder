import React, { FC, useCallback, useRef, memo, FormEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport, faTimes } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Input,
  IconButton
} from '@material-ui/core';

import { useCriteriaContext } from 'components/CriteriaProvider';
import useStyles from './styles';

interface ImportCriteriaModalProps {
  open: boolean;
  onClose: () => void;
}

const ImportCriteriaModal: FC<ImportCriteriaModalProps> = ({ open, onClose }) => {
  const styles = useStyles();
  const importFileRef = useRef<HTMLInputElement>(null);

  const { addCriteria } = useCriteriaContext();

  const selectFile = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const files = importFileRef.current?.files;
      if (files?.length) addCriteria(files[0]);
      onClose();
    },
    [addCriteria, onClose]
  );

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="import-criteria" fullWidth maxWidth="md">
      <DialogTitle disableTypography>
        <IconButton aria-label="close" onClick={onClose} className={styles.dialogCloseButton}>
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={selectFile}>
        <DialogContent>
          <Input
            autoFocus
            fullWidth
            required
            inputRef={importFileRef}
            type="file"
            inputProps={{ accept: '.json' }}
          />
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FontAwesomeIcon icon={faFileImport} />}
            type="submit"
          >
            Import
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default memo(ImportCriteriaModal);
