import React, { FC, memo, useCallback } from 'react';
import { Snackbar, Button, IconButton } from '@material-ui/core';
import { useSnackbarContext } from 'components/SnackbarProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';

const DeleteSnackbar: FC = () => {
  const { undoPathway } = useCurrentPathwayContext();
  const { snackbarText, openSnackbar, handleCloseSnackbar } = useSnackbarContext();

  const undo = useCallback(() => {
    undoPathway();
    handleCloseSnackbar();
  }, [undoPathway, handleCloseSnackbar]);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      open={openSnackbar}
      autoHideDuration={10000}
      onClose={handleCloseSnackbar}
      message={snackbarText}
      action={
        <React.Fragment>
          <Button color="secondary" size="small" onClick={undo}>
            UNDO
          </Button>
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </React.Fragment>
      }
    />
  );
};

export default memo(DeleteSnackbar);
