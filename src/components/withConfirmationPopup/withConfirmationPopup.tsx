import React, { FC, useState } from 'react';
import styles from './withConfirmationPopup.module.scss';
import PathwayPopup from 'components/PathwayPopup';
import ActionButton from 'components/ActionButton';

type ConfirmationProps = {
  deleteType: string;
  deleteName: string;
  onConfirm: () => void;
};

type WithConfirmationPopupProps<T> = T & ConfirmationProps;

const withConfirmationPopup = <T extends object>(
  WrappedComponent: FC<T>
): FC<WithConfirmationPopupProps<T>> => {
  const PopupComponent: FC<WithConfirmationPopupProps<T>> = ({
    deleteType,
    deleteName,
    onConfirm,
    ...wrappedProps
  }) => {
    const [open, setOpen] = useState<boolean>(false);
    // https://github.com/Semantic-Org/Semantic-UI-React/issues/2487]
    return (
      <PathwayPopup
        className={styles.withConfirmationPopup}
        Content={
          <PopupContent
            deleteType={deleteType}
            deleteName={deleteName}
            setOpen={setOpen}
            onConfirm={onConfirm}
          />
        }
        open={open}
        setOpen={setOpen}
        Trigger={
          <div className={styles.triggerContainer} {...wrappedProps}>
            <WrappedComponent {...(wrappedProps as T)} />
          </div>
        }
      />
    );
  };
  return PopupComponent;
};

interface PopupContentProps {
  deleteType: string;
  deleteName: string;
  setOpen: Function;
  onConfirm: () => void;
}

const PopupContent: FC<PopupContentProps> = ({ deleteType, deleteName, setOpen, onConfirm }) => {
  return (
    <div className={styles.popupContent}>
      <div>
        Are you sure you would like to delete the {deleteName} {deleteType}?{' '}
      </div>
      <div>
        <ActionButton
          size="small"
          type="accept"
          onClick={(): void => {
            onConfirm();
            setOpen(false);
          }}
        />
        <ActionButton size="small" type="decline" onClick={(): void => setOpen(false)} />
      </div>
    </div>
  );
};

export default withConfirmationPopup;
