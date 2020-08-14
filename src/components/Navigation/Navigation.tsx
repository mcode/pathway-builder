import React, { FC, useCallback, useState, MouseEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@material-ui/core';

import { useBuildCriteriaContext } from 'components/BuildCriteriaProvider';
import useStyles from './styles';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';
import ExportMenu from 'components/elements/ExportMenu';

const Navigation: FC = () => {
  const { updateBuildCriteriaNodeId } = useBuildCriteriaContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { pathway } = useCurrentPathwayContext();
  const styles = useStyles();
  const history = useHistory();

  const openMenu = useCallback((event: MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  }, []);

  const closeMenu = useCallback((): void => {
    setAnchorEl(null);
  }, []);

  const handleGoBack = useCallback((): void => {
    updateBuildCriteriaNodeId('');
    history.push('/');
  }, [history, updateBuildCriteriaNodeId]);

  return (
    <nav className={styles.root}>
      <div>
        <IconButton className={styles.backButton} onClick={handleGoBack} aria-label="go back">
          <FontAwesomeIcon icon={faChevronLeft} className={styles.navigationIcons} />
        </IconButton>

        <span className={styles.pathwayName}>{pathway?.name}</span>
      </div>
      <IconButton onClick={openMenu} aria-controls="pathway-options-menu" aria-haspopup="true">
        <FontAwesomeIcon icon={faEllipsisH} className={styles.navigationIcons} />
      </IconButton>
      <ExportMenu anchorEl={anchorEl} closeMenu={closeMenu} />
    </nav>
  );
};

export default Navigation;
