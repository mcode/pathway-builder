import React, { FC, memo, useCallback } from 'react';
import { Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ConfirmationPopover from 'components/elements/ConfirmationPopover';

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
  const displayText =
    'Are you sure' +
    (deleteType && deleteMethod
      ? ' that you would like to delete the ' + deleteName + ' ' + deleteType + ' ?'
      : '?');

  const onConfirm = useCallback((): void => {
    deleteMethod(deleteId);
  }, [deleteId, deleteMethod]);

  return (
    <ConfirmationPopover onConfirm={onConfirm} displayText={displayText}>
      <Button color="secondary" size="small" startIcon={<FontAwesomeIcon icon={faTrashAlt} />}>
        Delete
      </Button>
    </ConfirmationPopover>
  );
};

export default memo(ConfirmedDeletionButton);
