import React, { FC, memo, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@material-ui/core';

import { usePathwayContext } from 'components/PathwayProvider';
import Loading from 'components/elements/Loading';
import CriteriaTable from './CriteriaTable';
import ImportCriteriaModal from './ImportCriteriaModal';

import useStyles from './styles';

const CriteriaList: FC = () => {
  const styles = useStyles();
  const { status } = usePathwayContext();

  const [open, setOpen] = useState(false);
  const openImportModal = useCallback((): void => {
    setOpen(true);
  }, []);

  const closeImportModal = useCallback((): void => {
    setOpen(false);
  }, []);

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
          startIcon={<FontAwesomeIcon icon={faPlus} />}
        >
          Build Criteria
        </Button>
      </div>

      <ImportCriteriaModal open={open} onClose={closeImportModal} />

      {status === 'loading' ? <Loading /> : <CriteriaTable />}
    </div>
  );
};

export default memo(CriteriaList);
