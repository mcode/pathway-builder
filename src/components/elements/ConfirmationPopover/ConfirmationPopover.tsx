import React, { ComponentPropsWithRef, FC, memo, MouseEvent, ReactNode, useCallback, useState } from 'react';
import { Popover } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ActionButton from '../../ActionButton/ActionButton';
import useStyles from '../../ConfirmedDeletionButton/styles';

interface ConfirmationPopoverProps {
  children: React.ReactNode;
  displayText: string;
  onConfirm?: () => void;
  onDecline?: () => void;
}

type Ref = HTMLDivElement;

const ConfirmationPopover = React.forwardRef<Ref, ConfirmationPopoverProps>(({
  children,
  displayText,
  onConfirm,
  onDecline,
  ...props
}, ref) => {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const onClickHandler = useCallback((event: MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  }, []);

  const onAcceptHandler = useCallback((): void => {
    if (onConfirm) onConfirm();
    setOpen(false);
    setAnchorEl(null);
  }, [onConfirm]);

  const onDeclineHandler = useCallback((): void => {
    if (onDecline) onDecline();
    setOpen(false);
    setAnchorEl(null);
  }, [onDecline]);

  return (
    <div className={styles.container} {...props} ref={ref}>
      <ClickAwayListener onClickAway={onDeclineHandler}>
        <div onClick={onClickHandler} className={styles.container}>
          {children}
        </div>
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
          <ActionButton size="small" type="accept" onClick={onAcceptHandler} />
          <ActionButton size="small" type="decline" onClick={onDeclineHandler} />
        </div>
      </Popover>
    </div>
  );
});

export default memo(ConfirmationPopover);
