import React, { FC, useState } from 'react';
import styles from './withConfirmationPopup.module.scss';
import PathwayPopup from 'components/PathwayPopup';
import ActionButton from 'components/ActionButton';

type ConfirmationProps = {
  onConfirm: (id: string) => void;
  onConfirmParameter: string;
  displayText?: string;
};

type WithConfirmationPopupProps<T> = T & ConfirmationProps;

const withConfirmationPopup = <T extends object>(
  WrappedComponent: FC<T>
): FC<WithConfirmationPopupProps<T>> => {
  const PopupComponent: FC<WithConfirmationPopupProps<T>> = ({
    onConfirm,
    onConfirmParameter,
    displayText,
    ...wrappedProps
  }) => {
    const [open, setOpen] = useState<boolean>(false);
    // https://github.com/Semantic-Org/Semantic-UI-React/issues/2487]
    return (
      <PathwayPopup
        className={styles.withConfirmationPopup}
        Content={
          <PopupContent
            displayText={displayText}
            setOpen={setOpen}
            onConfirm={(): void => onConfirm(onConfirmParameter)}
          />
        }
        open={open}
        setOpen={setOpen}
        Trigger={
          <div className={styles.triggerContainer}>
            <WrappedComponent {...(wrappedProps as T)} />
          </div>
        }
      />
    );
  };
  return PopupComponent;
};

interface PopupContentProps {
  setOpen: Function;
  onConfirm: () => void;
  displayText?: string;
}

const PopupContent: FC<PopupContentProps> = ({ setOpen, onConfirm, displayText }) => {
  return (
    <div className={styles.popupContent}>
      <div>{displayText || 'Are you sure?'}</div>
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
