import React, { FC, useState, useRef, FormEvent, useCallback, memo } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Input
} from '@material-ui/core';
import useStyles from './styles';
import { faFileImport, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface FileImportModalProps {
  open: boolean;
  onClose: () => void;
  onSelectFile: (files: FileList | undefined | null) => void;
  allowedFileType?: string; // Setting this to undefined will allow any file type to be selected
  loading?: boolean;
}

const FileImportModal: FC<FileImportModalProps> = ({
  open,
  onClose,
  onSelectFile,
  allowedFileType,
  loading = false
}) => {
  const styles = useStyles();
  const [fileName, setFileName] = useState<string>('');
  const importFileRef = useRef<HTMLInputElement>(null);

  const selectFile = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const files = importFileRef?.current?.files;
      onSelectFile(files);
      setFileName('');
    },
    [onSelectFile]
  );

  const handleChooseFile = useCallback(() => {
    if (importFileRef?.current?.files?.[0]) setFileName(importFileRef.current.files[0].name);
  }, [importFileRef]);

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="import-pathway" fullWidth maxWidth="sm">
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
              inputProps={{ accept: allowedFileType }} // TODO: how to allow multiple types?
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
              {fileName ? <span>{fileName}</span> : <span>Choose file to import.</span>}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FontAwesomeIcon icon={faFileImport} />}
            endIcon={loading ? <FontAwesomeIcon icon={faSpinner} spin /> : null}
            type="submit"
            disabled={loading}
          >
            Import
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default memo(FileImportModal);
