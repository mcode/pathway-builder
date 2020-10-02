import React, { FC, memo, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@material-ui/core';

import { usePathwaysContext } from 'components/PathwaysProvider';
import Loading from 'components/elements/Loading';
import CriteriaTable from './CriteriaTable';

import useStyles from './styles';
import FileImportModal from '../FileImportModal';
import { useCriteriaContext } from '../CriteriaProvider';

const CriteriaList: FC = () => {
  const styles = useStyles();
  const { status } = usePathwaysContext();

  const { addCriteria } = useCriteriaContext();

  const [open, setOpen] = useState<boolean>(false);
  const openImportModal = useCallback((): void => {
    setOpen(true);
  }, []);

  const closeImportModal = useCallback((): void => {
    setOpen(false);
  }, []);

  const selectFile = useCallback(
    (files: FileList | undefined | null) => {
      if (files?.length) addCriteria(files[0]);
    },
    [addCriteria]
  );

  return (
    <div className={styles.root}>
      <div className={styles.buttonRow}>
        <Button
          className={styles.buildCriteriaButton}
          variant="contained"
          color="primary"
          startIcon={<FontAwesomeIcon icon={faFileImport} />}
          onClick={openImportModal}
        >
          Import Library
        </Button>
        <Button
          className={styles.buildCriteriaButton}
          variant="contained"
          color="primary"
          startIcon={<FontAwesomeIcon icon={faTools} />}
        >
          Build Criteria
        </Button>
      </div>

      <FileImportModal
        open={open}
        onClose={closeImportModal}
        onSelectFile={selectFile}
        allowedFileType=".cql"
      />

      {status === 'loading' ? <Loading /> : <CriteriaTable />}
    </div>
  );
};

export default memo(CriteriaList);
