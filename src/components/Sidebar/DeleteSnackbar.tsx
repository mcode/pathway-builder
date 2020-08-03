import React, { FC, memo } from 'react';
import { Snackbar, Button, IconButton } from '@material-ui/core';
import { useSnackbarContext } from 'components/SnackbarProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const DeleteSnackbar: FC = () => {
  const { snackbarText, openSnackbar, handleCloseSnackbar } = useSnackbarContext();

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
          <Button color="secondary" size="small" onClick={handleCloseSnackbar}>
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
