import React, { FC, useState, useRef, FormEvent, useCallback, memo } from 'react';
import { Pathway } from 'pathways-model';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Input } from '@material-ui/core';
import useStyles from './styles';
import { usePathwaysContext } from 'components/PathwaysProvider';
import { faFileImport, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ImportPathwayModalProps {
  open: boolean;
  onClose: () => void;
}

const ImportPathwayModal: FC<ImportPathwayModalProps> = ({open, onClose}) => {
  const styles = useStyles();
  const [fileName, setFileName] = useState<string>('');
  const importFileRef = useRef<HTMLInputElement>(null);

  const { addPathway } = usePathwaysContext();

  const selectFile = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const files = importFileRef?.current?.files;
      if (files?.length) addPathway(files[0] as unknown as Pathway);
      onClose();
      setFileName('');
    },
    []
  );

  const handleChooseFile = useCallback(() => {
    if (importFileRef?.current?.files?.[0]) setFileName(importFileRef.current.files[0].name);
  }, [importFileRef]);

  return (
    <Dialog open={open} onClose={onClose} aira-labelledby="import-pathway" fullWidth maxWidth="sm">
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
              inputProps={{accept: '.json'}} // TODO: how to allow multiple tpyes?
              onChange={handleChooseFile}
            />
            <label htmlFor="choose-file-input">
              <Button className={styles.inputButton} variant="contained" color="primary" component="span">
                Choose File
              </Button>
            </label>

            <div className={styles.fileName}>
              {fileName ? <span>{fileName}</span> : <span>Choose file to import.</span>}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" startIcon={<FontAwesomeIcon icon={faFileImport}/>} type="submit">
            Import
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default memo(ImportPathwayModal);
