import React, { FC, useCallback, useState, MouseEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { IconButton, Menu, MenuItem } from '@material-ui/core';

import { Pathway } from 'pathways-model';
import { downloadPathway } from 'utils/builder';
import useStyles from './styles';

interface Props {
  pathway: Pathway;
}

const Navigation: FC<Props> = ({ pathway }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const styles = useStyles();
  const history = useHistory();

  const openMenu = useCallback((event: MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  }, []);

  const closeMenu = useCallback((): void => {
    setAnchorEl(null);
  }, []);

  const handleGoBack = useCallback((): void => {
    history.push('/');
  }, [history]);

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
      <Menu
        id="pathway-options-menu"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        <MenuItem
          onClick={(): void => {
            downloadPathway(pathway);
            closeMenu();
          }}
        >
          Export Pathway
        </MenuItem>
      </Menu>
    </nav>
  );
};

export default Navigation;
