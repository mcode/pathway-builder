import React, { FC, memo, useState, MouseEvent, useCallback } from 'react';

import { Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Popover from '@material-ui/core/Popover';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import useStyles from './styles';

import ActionButton from 'components/ActionButton';

interface ConfirmedDeletionButtonProps {
  deleteId: string;
  deleteMethod: (id: string) => void;
  deleteType?: string;
  deleteName?: string;
}

const ConfirmedDeletionButton: FC<ConfirmedDeletionButtonProps> = ({
  deleteId,
  deleteMethod,
  deleteType,
  deleteName
}) => {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const displayText =
    'Are you sure ' +
    (deleteType && deleteMethod
      ? 'that you would like to delete the ' + deleteName + ' ' + deleteType + ' ?'
      : '?');

  const onClickHandler = useCallback((event: MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  }, []);

  const onCloseHandler = useCallback(
    (accept?: boolean): void => {
      if (accept) deleteMethod(deleteId);
      setOpen(false);
      setAnchorEl(null);
    },
    [deleteId, deleteMethod]
  );

  return (
    <div className={styles.container}>
      <ClickAwayListener onClickAway={(): void => onCloseHandler(false)}>
        <Button
          color="secondary"
          size="small"
          startIcon={<FontAwesomeIcon icon={faTrashAlt} />}
          onClick={onClickHandler}
        >
          Delete
        </Button>
      </ClickAwayListener>
      <Popover
        classes={{ paper: styles.paper }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <div className={styles.displayText}> {displayText} </div>
        <div className={styles.buttons}>
          <ActionButton size="small" type="accept" onClick={(): void => onCloseHandler(true)} />
          <ActionButton size="small" type="decline" onClick={(): void => onCloseHandler(false)} />
        </div>
      </Popover>
    </div>
  );
};

export default memo(ConfirmedDeletionButton);
