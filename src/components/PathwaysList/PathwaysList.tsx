import React, { FC, useCallback, useState, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@material-ui/core';

import { usePathwayContext } from 'components/PathwayProvider';
import Loading from 'components/elements/Loading';
import PathwaysTable from './PathwaysTable';
import NewPathwayModal from './NewPathwayModal';

import useStyles from './styles';

const PathwaysList: FC = () => {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const { status } = usePathwayContext();

  const handleClickOpen = useCallback((): void => {
    setOpen(true);
  }, []);

  const handleClose = useCallback((): void => {
    setOpen(false);
  }, []);

  return (
    <div className={styles.root}>
      <Button
        className={styles.createPathwayButton}
        variant="contained"
        color="primary"
        startIcon={<FontAwesomeIcon icon={faPlus} />}
        onClick={handleClickOpen}
      >
        Create Pathway
      </Button>

      <NewPathwayModal open={open} onClose={handleClose} />
      {status === 'loading' ? <Loading /> : <PathwaysTable />}
    </div>
  );
};

export default memo(PathwaysList);
