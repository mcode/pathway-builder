import React, { FC, useCallback, useState, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@material-ui/core';

import { usePathwaysContext } from 'components/PathwaysProvider';
import Loading from 'components/elements/Loading';
import PathwaysTable from './PathwaysTable';
import PathwayModal from './PathwayModal';

import useStyles from './styles';
import FileImportModal from 'components/FileImportModal';

const PathwaysList: FC = () => {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const { status } = usePathwaysContext();
  const [importPathwayOpen, _setImportPathwayOpen] = useState(false);

  const { addPathwayFromFile } = usePathwaysContext();

  const openNewPathwayModal = useCallback((): void => {
    setOpen(true);
  }, []);

  const closeNewPathwayModal = useCallback((): void => {
    setOpen(false);
  }, []);

  const selectFile = useCallback(
    (files: FileList | undefined | null) => {
      if (files?.length) addPathwayFromFile((files[0] as unknown) as File);
    },
    [addPathwayFromFile]
  );

  const openImportPathwayModal = useCallback((): void => _setImportPathwayOpen(true), []);

  const closeImportPathwayModal = useCallback((): void => _setImportPathwayOpen(false), []);

  return (
    <div className={styles.root}>
      <div className={styles.buttonRow}>
        <Button
          className={styles.createPathwayButton}
          variant="contained"
          color="primary"
          startIcon={<FontAwesomeIcon icon={faFileImport} />}
          onClick={openImportPathwayModal}
        >
          Import Pathway
        </Button>

        <Button
          className={styles.createPathwayButton}
          variant="contained"
          color="primary"
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          onClick={openNewPathwayModal}
        >
          Create Pathway
        </Button>
      </div>

      <FileImportModal
        open={importPathwayOpen}
        onClose={closeImportPathwayModal}
        onSelectFile={selectFile}
        allowedFileType=".json"
      />

      <PathwayModal open={open} onClose={closeNewPathwayModal} />

      {status === 'loading' ? <Loading /> : <PathwaysTable />}
    </div>
  );
};

export default memo(PathwaysList);
