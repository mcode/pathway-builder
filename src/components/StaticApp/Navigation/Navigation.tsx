import React, { FC, useCallback, useState, MouseEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faEllipsisH, faRedo, faUndo } from '@fortawesome/free-solid-svg-icons';
import { IconButton, Tooltip } from '@material-ui/core';

import { useCurrentCriteriaContext } from 'components/StaticApp/CurrentCriteriaProvider';
import useStyles from './styles';
import { useCurrentPathwayContext } from 'components/StaticApp/CurrentPathwayProvider';
import { ContextualExportMenu } from 'components/StaticApp/elements/ExportMenu';

const Navigation: FC = () => {
  const { resetCurrentCriteria } = useCurrentCriteriaContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const {
    pathway,
    canUndoPathway,
    canRedoPathway,
    undoPathway,
    redoPathway
  } = useCurrentPathwayContext();
  const styles = useStyles();
  const history = useHistory();

  const openMenu = useCallback((event: MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  }, []);

  const closeMenu = useCallback((): void => {
    setAnchorEl(null);
  }, []);

  const handleGoBack = useCallback((): void => {
    resetCurrentCriteria();
    history.push('/demo');
  }, [history, resetCurrentCriteria]);

  return (
    <nav className={styles.root}>
      <div>
        <IconButton className={styles.backButton} onClick={handleGoBack} aria-label="go back">
          <FontAwesomeIcon icon={faChevronLeft} className={styles.navigationIcons} />
        </IconButton>

        <span className={styles.pathwayName}>{pathway?.name}</span>
      </div>
      <div>
        <Tooltip placement="top" title="Undo" arrow>
          <span>
            <IconButton onClick={undoPathway} disabled={!canUndoPathway} aria-label="undo">
              <FontAwesomeIcon icon={faUndo} className={styles.navigationIcons} />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip placement="top" title="Redo" arrow>
          <span>
            <IconButton onClick={redoPathway} disabled={!canRedoPathway} aria-label="redo">
              <FontAwesomeIcon icon={faRedo} className={styles.navigationIcons} />
            </IconButton>
          </span>
        </Tooltip>
        <IconButton onClick={openMenu} aria-controls="pathway-options-menu" aria-haspopup="true">
          <FontAwesomeIcon icon={faEllipsisH} className={styles.navigationIcons} />
        </IconButton>
        <ContextualExportMenu anchorEl={anchorEl} closeMenu={closeMenu} />
      </div>
    </nav>
  );
};

export default Navigation;
