import React, { FC, memo, useCallback, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@material-ui/core';

import { usePathwayContext } from 'components/PathwayProvider';
import Loading from 'components/elements/Loading';
import CriteriaTable from './CriteriaTable';

import useStyles from './styles';
import { useCriteriaContext } from 'components/CriteriaProvider';

const CriteriaList: FC = () => {
  const styles = useStyles();
  const { status } = usePathwayContext();
  const { addCriteria } = useCriteriaContext();

  const selectFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files?.length) addCriteria(files[0]);
    },
    [addCriteria]
  );

  return (
    <div className={styles.root}>
      <input type="file" accept=".json" onChange={selectFile} />
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
