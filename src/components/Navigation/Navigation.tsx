import React, { FC, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@material-ui/core';

import { Pathway } from 'pathways-model';
import useStyles from './styles';

interface Props {
  pathway?: Pathway | null;
}

const Navigation: FC<Props> = ({ pathway }) => {
  const styles = useStyles();
  const history = useHistory();

  const handleGoBack = useCallback((): void => {
    history.push('/');
  }, [history]);

  return (
    <nav className={styles.root}>
      <IconButton className={styles.backButton} onClick={handleGoBack} aria-label="go back">
        <FontAwesomeIcon icon={faChevronLeft} className={styles.backIcon} />
      </IconButton>

      <div className={styles.pathwayName}>{pathway?.name}</div>
    </nav>
  );
};

export default Navigation;
