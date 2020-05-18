import React, { FC, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@material-ui/core';

import { usePathwayContext } from 'components/PathwayProvider';
import Loading from 'components/elements/Loading';
import CriteriaTable from './CriteriaTable';

import useStyles from './styles';

const CriteriaList: FC = () => {
  const styles = useStyles();
  const { status } = usePathwayContext();

  return (
    <div className={styles.root}>
      <Button
        className={styles.buildCriteriaButton}
        variant="contained"
        color="primary"
        startIcon={<FontAwesomeIcon icon={faPlus} />}
      >
        Create Pathway
      </Button>

      {status === 'loading' ? <Loading /> : <CriteriaTable />}
    </div>
  );
};

export default memo(CriteriaList);
