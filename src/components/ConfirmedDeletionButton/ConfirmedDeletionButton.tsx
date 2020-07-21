import React, { FC, memo } from 'react';
import withConfirmationPopup from 'components/withConfirmationPopup';

import { Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

interface ConfirmedDeletionButtonProps {
  deleteType: string;
  deleteName: string;
  deleteId: string;
  deleteMethod: (id: string) => void;
}

const ConfirmedDeletionButton: FC<ConfirmedDeletionButtonProps> = ({
  deleteType,
  deleteName,
  deleteId,
  deleteMethod
}) => {
  const ButtonPopup = withConfirmationPopup(Button);
  const confirmationText =
    'Are you sure you would like to delete the ' + deleteName + ' ' + deleteType + ' ?';

  return (
    <ButtonPopup
      onConfirm={deleteMethod}
      onConfirmParameter={deleteId}
      color="secondary"
      size="small"
      startIcon={<FontAwesomeIcon icon={faTrashAlt} />}
      displayText={confirmationText}
    >
      Delete
    </ButtonPopup>
  );
};

export default memo(ConfirmedDeletionButton);
