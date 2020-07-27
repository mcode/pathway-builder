import React, { FC, memo, useCallback, useRef, useState, KeyboardEvent, FocusEvent } from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faEllipsisH,
  faChevronLeft,
  faChevronRight,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { IconButton, FormControl, Input, Tooltip } from '@material-ui/core';

import { PathwayNode } from 'pathways-model';
import { setNodeLabel, removeNode } from 'utils/builder';
import { usePathwaysContext } from 'components/PathwaysProvider';
import useStyles from './styles';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';
import { useHistory } from 'react-router-dom';
import { canDeleteNode, redirect, findParents } from 'utils/nodeUtils';
import { DeleteModal } from '.';

interface SidebarHeaderProps {
  node: PathwayNode;
  isTransition: boolean;
}

const SidebarHeader: FC<SidebarHeaderProps> = ({ node, isTransition }) => {
  const { updatePathway } = usePathwaysContext();
  const [showInput, setShowInput] = useState<boolean>(false);
  const [openTooltip, setOpenTooltip] = useState<boolean>(false);
  const [openDeleteNode, setOpenDeleteNode] = useState<boolean>(false);
  const { pathway, pathwayRef } = useCurrentPathwayContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const nodeLabel = node?.label || '';
  const styles = useStyles();
  const history = useHistory();

  const goToParentNode = useCallback(() => {
    // TODO
  }, []);

  const redirectToNode = useCallback(() => {
    if (!pathwayRef.current || !node.key) return;
    redirect(pathwayRef.current.id, node.key, history);
  }, [history, pathwayRef, node.key]);

  const openNodeOptions = useCallback(() => {
    // TODO
  }, []);

  const changeNodeLabel = useCallback(() => {
    const label = inputRef.current?.value ?? '';
    if (node.key && pathwayRef.current)
      updatePathway(setNodeLabel(pathwayRef.current, node.key, label));
    setShowInput(false);
  }, [pathwayRef, updatePathway, node.key]);

  const handleShowInput = useCallback(() => {
    setShowInput(true);
  }, []);

  const deleteNode = useCallback(() => {
    if (node.key && pathwayRef.current && canDeleteNode(pathwayRef.current, node)) {
      const parents = findParents(pathwayRef.current, node.key);
      updatePathway(removeNode(pathwayRef.current, node.key));
      redirect(pathwayRef.current.id, parents[0], history);
      setOpenDeleteNode(false);
    }
  }, [pathwayRef, updatePathway, node, history]);

  const deleteTransition = useCallback(() => {
    console.log('delete transition');
  }, []);

  const openDeleteNodeModal = useCallback((): void => {
    setOpenDeleteNode(true);
  }, []);

  const closeDeleteNodeModal = useCallback((): void => {
    setOpenDeleteNode(false);
  }, []);

  const handleOpenTooltip = useCallback((): void => {
    setOpenTooltip(true);
  }, []);

  const handleCloseTooltip = useCallback((): void => {
    setOpenTooltip(false);
  }, []);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent<HTMLDivElement>): void => {
      if (event.key === 'Enter') changeNodeLabel();
    },
    [changeNodeLabel]
  );

  const deleteDisabled = !isTransition && pathway ? !canDeleteNode(pathway, node) : true;

  return (
    <div className={styles.sidebarHeader}>
      <div className={styles.sidebarHeaderGroup}>
        {node.key !== 'Start' && !isTransition && (
          <IconButton
            className={styles.sidebarHeaderButton}
            onClick={goToParentNode}
            aria-label="go to parent node"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </IconButton>
        )}

        <div className={styles.headerLabelGroup} onClick={handleShowInput}>
          {showInput && node.key !== 'Start' ? (
            <FormControl className={styles.formControl} fullWidth>
              <Input
                className={styles.headerLabel}
                type="text"
                inputRef={inputRef}
                onBlur={changeNodeLabel}
                onKeyPress={handleKeyPress}
                defaultValue={nodeLabel}
                autoFocus
                onFocus={(event: FocusEvent<HTMLInputElement>): void => event.target.select()}
              />
            </FormControl>
          ) : (
            <div
              className={clsx(
                styles.headerLabel,
                styles.headerLabelText,
                node.key === 'Start' && styles.headerLabelStart
              )}
            >
              {nodeLabel}
              {node.key !== 'Start' && (
                <FontAwesomeIcon className={styles.editIcon} icon={faEdit} />
              )}
            </div>
          )}
        </div>
      </div>

      <div className={styles.sidebarHeaderGroup}>
        {node.key !== 'Start' && (
          <Tooltip
            placement="top"
            open={deleteDisabled ? openTooltip : false}
            onClose={handleCloseTooltip}
            onOpen={handleOpenTooltip}
            title="Disabled"
            arrow
          >
            <span>
              <IconButton
                className={styles.sidebarHeaderButton}
                onClick={isTransition ? deleteTransition : openDeleteNodeModal}
                aria-label={isTransition ? 'delete transition' : 'delete node'}
                disabled={deleteDisabled}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </IconButton>
            </span>
          </Tooltip>
        )}
        <IconButton
          className={styles.sidebarHeaderButton}
          onClick={isTransition ? redirectToNode : openNodeOptions}
          aria-label={isTransition ? 'go to transition node' : 'open node options'}
        >
          <FontAwesomeIcon icon={isTransition ? faChevronRight : faEllipsisH} />
        </IconButton>
      </div>

      <DeleteModal
        nodeLabel={node.label}
        isTransition={false}
        open={openDeleteNode}
        onDelete={deleteNode}
        onClose={closeDeleteNodeModal}
      />
    </div>
  );
};

export default memo(SidebarHeader);
