import React, { FC, memo, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@material-ui/core';

import { usePathwayContext } from 'components/PathwayProvider';
import Loading from 'components/elements/Loading';
import PreconditionTable from './PreconditionTable';
import ImportPreconditionModal from './ImportPreconditionModal';

import useStyles from './styles';

const PreconditionList: FC = () => {
  const styles = useStyles();
  const { status } = usePathwayContext();

  const [open, setOpen] = useState<boolean>(false);
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
          className={styles.buildPreconditionButton}
          variant="contained"
          color="primary"
          startIcon={<FontAwesomeIcon icon={faFileImport} />}
          onClick={openImportModal}
        >
          Import Library
        </Button>
        <Button
          className={styles.buildPreconditionButton}
          variant="contained"
          color="primary"
          startIcon={<FontAwesomeIcon icon={faTools} />}
        >
          Build Precondition
        </Button>
      </div>

      <ImportPreconditionModal open={open} onClose={closeImportModal} />

      {status === 'loading' ? <Loading /> : <PreconditionTable />}
    </div>
  );
};

export default memo(PreconditionList);
