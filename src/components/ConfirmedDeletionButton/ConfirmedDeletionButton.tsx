import React, { FC, memo } from 'react';
import withConfirmationPopup from 'components/withConfirmationPopup';

import { Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

interface ConfirmedDeletionButtonProps {
  deleteType: string;
  deleteName: string;
  deleteMethod: () => void;
}

const ConfirmedDeletionButton: FC<ConfirmedDeletionButtonProps> = ({
  deleteType,
  deleteName,
  deleteMethod
}) => {
  const ButtonPopup = withConfirmationPopup(Button);

  return (
    <ButtonPopup
      color="secondary"
      size="small"
      startIcon={<FontAwesomeIcon icon={faTrashAlt} />}
      deleteType={deleteType}
      deleteName={deleteName}
      onConfirm={deleteMethod}
    >
      Delete
    </ButtonPopup>
  );
};

export default memo(ConfirmedDeletionButton);
