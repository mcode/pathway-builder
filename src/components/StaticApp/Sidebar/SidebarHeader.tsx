import React, { FC, memo, useCallback, useRef, useState, KeyboardEvent, FocusEvent } from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faChevronLeft,
  faChevronRight,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { IconButton, FormControl, Input, Tooltip } from '@material-ui/core';

import { PathwayNode } from 'pathways-model';
import { setNodeLabel, removeNode, removeTransition } from 'utils/builder';
import useStyles from 'components/Sidebar/styles';
import { useCurrentPathwayContext } from 'components/StaticApp/CurrentPathwayProvider';
import { useHistory } from 'react-router-dom';
import { canDeleteNode, redirect, findParents, willOrphanChild } from 'utils/nodeUtils';
import { DeleteModal } from 'components/Sidebar';
import { useSnackbarContext } from 'components/SnackbarProvider';
import useCurrentNodeStatic from 'hooks/useCurrentNodeStatic';

interface SidebarHeaderProps {
  node: PathwayNode;
  isTransition?: boolean;
}

const SidebarHeader: FC<SidebarHeaderProps> = ({ node, isTransition = false }) => {
  const [showInput, setShowInput] = useState<boolean>(false);
  const [openTooltip, setOpenTooltip] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const { setSnackbarText, setOpenSnackbar } = useSnackbarContext();
  const { pathway, pathwayRef, setCurrentPathway } = useCurrentPathwayContext();
  const currentNodeStatic = useCurrentNodeStatic(pathway);
  const inputRef = useRef<HTMLInputElement>(null);
  const nodeLabel = node?.label || '';
  const styles = useStyles();
  const history = useHistory();

  const goToParentNode = useCallback(() => {
    if (!pathwayRef.current) return;
    const parents = findParents(pathwayRef.current.nodes, node.key);
    redirect(pathwayRef.current.id, parents[0], history, true);
  }, [history, pathwayRef, node.key]);

  const redirectToNode = useCallback(() => {
    if (!pathwayRef.current) return;
    redirect(pathwayRef.current.id, node.key, history, true);
  }, [history, pathwayRef, node.key]);

  const changeNodeLabel = useCallback(() => {
    const label = inputRef.current?.value ?? '';
    if (pathwayRef.current) setCurrentPathway(setNodeLabel(pathwayRef.current, node.key, label));
    setShowInput(false);
  }, [pathwayRef, setCurrentPathway, node.key]);

  const handleShowInput = useCallback(() => {
    setShowInput(true);
  }, []);

  const deleteNode = useCallback(() => {
    if (pathwayRef.current && canDeleteNode(pathwayRef.current, node.transitions)) {
      const parents = findParents(pathwayRef.current.nodes, node.key);
      setCurrentPathway(removeNode(pathwayRef.current, node.key));
      redirect(pathwayRef.current.id, parents[0], history, true);
      setOpenDelete(false);
      setSnackbarText(`${node.label} node deleted successfully`);
      setOpenSnackbar(true);
    }
  }, [
    pathwayRef,
    setCurrentPathway,
    setSnackbarText,
    setOpenSnackbar,
    node.key,
    node.label,
    node.transitions,
    history
  ]);

  const deleteTransition = useCallback(() => {
    if (currentNodeStatic && pathwayRef.current && !willOrphanChild(pathwayRef.current, node.key)) {
      setCurrentPathway(removeTransition(pathwayRef.current, currentNodeStatic.key, node.key));
      setOpenDelete(false);
      setSnackbarText(
        `Transition from ${currentNodeStatic.label} to ${node.label} deleted successfully`
      );
      setOpenSnackbar(true);
    }
  }, [pathwayRef, currentNodeStatic, setCurrentPathway, setSnackbarText, setOpenSnackbar, node]);

  const openDeleteModal = useCallback((): void => {
    setOpenDelete(true);
  }, []);

  const closeDeleteModal = useCallback((): void => {
    setOpenDelete(false);
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

  const deleteNodeDisabled = pathway ? !canDeleteNode(pathway, node.transitions) : true;
  const deleteTransitionDisabled = pathway ? willOrphanChild(pathway, node.key) : true;
  const deleteDisabled = isTransition ? deleteTransitionDisabled : deleteNodeDisabled;
  const titleText = isTransition
    ? 'Deleting this transition would result in an orphaned node. To delete, first add the child node as a transition to another node, or delete it directly.'
    : 'Deleting this node would result in an orphaned descendent node. To delete, first add another transition to the would-be orphaned node from another node, or delete it directly.';

  return (
    <div className={styles.sidebarHeader}>
      <div className={styles.sidebarHeaderGroup}>
        {node.type !== 'start' && !isTransition && (
          <IconButton
            className={styles.sidebarHeaderButton}
            onClick={goToParentNode}
            aria-label="go to parent node"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </IconButton>
        )}

        <div className={styles.headerLabelGroup} onClick={handleShowInput}>
          {showInput && node.type !== 'start' ? (
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
                node.type === 'start' && styles.headerLabelStart
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
        {node.type !== 'start' && (
          <Tooltip
            placement="top"
            open={deleteDisabled ? openTooltip : false}
            onClose={handleCloseTooltip}
            onOpen={handleOpenTooltip}
            title={titleText}
            arrow
          >
            <span>
              <IconButton
                className={styles.sidebarHeaderButton}
                onClick={openDeleteModal}
                aria-label={isTransition ? 'delete transition' : 'delete node'}
                disabled={deleteDisabled}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </IconButton>
            </span>
          </Tooltip>
        )}

        {isTransition && (
          <IconButton
            className={styles.sidebarHeaderButton}
            onClick={redirectToNode}
            aria-label={'go to transition node'}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </IconButton>
        )}
      </div>

      <DeleteModal
        nodeLabel={node.label}
        isTransition={isTransition}
        open={openDelete}
        onDelete={isTransition ? deleteTransition : deleteNode}
        onClose={closeDeleteModal}
      />
    </div>
  );
};

export default memo(SidebarHeader);
