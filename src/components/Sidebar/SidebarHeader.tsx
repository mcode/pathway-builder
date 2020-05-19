import React, { FC, memo, useCallback, useRef, useState, KeyboardEvent } from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faEllipsisH,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { IconButton, FormControl, Input } from '@material-ui/core';

import { Pathway, State } from 'pathways-model';
import { setStateLabel } from 'utils/builder';
import useStyles from './styles';

interface SidebarHeaderProps {
  pathway: Pathway;
  currentNode: State;
  updatePathway: (pathway: Pathway) => void;
  isChoiceNode: boolean;
}

const SidebarHeader: FC<SidebarHeaderProps> = ({
  pathway,
  currentNode,
  updatePathway,
  isChoiceNode
}) => {
  const [showInput, setShowInput] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentNodeKey = currentNode?.key;
  const currentNodeLabel = currentNode?.label || '';
  const styles = useStyles();

  const goToParentNode = useCallback(() => {
    // TODO
  }, []);

  const changeNodeLabel = useCallback(() => {
    const label = inputRef.current?.value ?? '';
    if (currentNodeKey) updatePathway(setStateLabel(pathway, currentNodeKey, label));
    setShowInput(false);
  }, [pathway, updatePathway, currentNodeKey]);

  const handleShowInput = useCallback(() => {
    setShowInput(true);
  }, []);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent<HTMLDivElement>): void => {
      if (event.key === 'Enter') changeNodeLabel();
    },
    [changeNodeLabel]
  );

  return (
    <div className={styles.sidebarHeader}>
      <div className={styles.sidebarHeaderGroup}>
        {currentNodeLabel !== 'Start' && !isChoiceNode && (
          <IconButton
            className={styles.backToParentButton}
            onClick={goToParentNode}
            aria-label="go to parent node"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </IconButton>
        )}

        <div className={styles.headerLabelGroup} onClick={handleShowInput}>
          {showInput ? (
            <FormControl className={styles.formControl} fullWidth>
              <Input
                className={styles.headerLabel}
                type="text"
                inputRef={inputRef}
                onBlur={changeNodeLabel}
                onKeyPress={handleKeyPress}
                defaultValue={currentNodeLabel}
                autoFocus
              />
            </FormControl>
          ) : (
            <div className={clsx(styles.headerLabel, styles.headerLabelText)}>
              {currentNodeLabel}
              <FontAwesomeIcon className={styles.editIcon} icon={faEdit} />
            </div>
          )}
        </div>
      </div>

      <div className={styles.sidebarHeaderGroup}>
        {isChoiceNode ? (
          <IconButton
            className={styles.backToParentButton}
            onClick={goToParentNode}
            aria-label="go to choice node"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </IconButton>
        ) : (
          <FontAwesomeIcon icon={faEllipsisH} />
        )}
      </div>
    </div>
  );
};

export default memo(SidebarHeader);
