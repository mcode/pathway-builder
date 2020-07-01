import React, { FC, useCallback, useRef, memo, FormEvent, useState } from 'react';
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

import { usePreconditionContext } from 'components/PreconditionProvider';
import useStyles from './styles';

interface ImportPreconditionModalProps {
  open: boolean;
  onClose: () => void;
}

const ImportPreconditionModal: FC<ImportPreconditionModalProps> = ({ open, onClose }) => {
  const styles = useStyles();
  const [fileName, setFileName] = useState<string>('');
  const importFileRef = useRef<HTMLInputElement>(null);

  const { addPrecondition } = usePreconditionContext();

  const selectFile = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const files = importFileRef?.current?.files;
      if (files?.length) addPrecondition(files[0]);
      onClose();
      setFileName('');
    },
    [addPrecondition, onClose]
  );

  const handleChooseFile = useCallback(() => {
    if (importFileRef?.current?.files?.[0]) setFileName(importFileRef.current.files[0].name);
  }, [importFileRef]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="import-precondition"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle disableTypography>
        <IconButton aria-label="close" onClick={onClose} className={styles.dialogCloseButton}>
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={selectFile}>
        <DialogContent>
          <div className={styles.chooseFileInput}>
            <Input
              id="choose-file-input"
              className={styles.input}
              inputRef={importFileRef}
              type="file"
              inputProps={{ accept: '.json' }}
              onChange={handleChooseFile}
            />

            <label htmlFor="choose-file-input">
              <Button
                className={styles.inputButton}
                variant="contained"
                color="primary"
                component="span"
              >
                Choose File
              </Button>
            </label>

            <div className={styles.fileName}>
              {fileName ? <span>{fileName}</span> : <span>Choose ELM file to import.</span>}
            </div>
          </div>
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

export default memo(ImportPreconditionModal);
