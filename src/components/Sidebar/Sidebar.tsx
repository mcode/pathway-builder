import React, { FC, memo, useCallback, useState, useRef, ChangeEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  SidebarHeader,
  ActionNodeEditor,
  SidebarButton,
  TransitionEditor,
  BranchTransition
} from 'components/Sidebar';
import { setNodeType, addTransition, createNode, addNode, getNodeType } from 'utils/builder';
import { usePathwaysContext } from 'components/PathwaysProvider';
import useStyles from './styles';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';
import { useCurrentNodeContext } from 'components/CurrentNodeProvider';
import { isBranchNode, redirect } from 'utils/nodeUtils';
import { nodeTypeOptions } from 'utils/nodeUtils';
import DropDown from 'components/elements/DropDown';
import DeleteSnackbar from './DeleteSnackbar';
import ConnectNodeButton from 'components/Sidebar/ConnectNodeButton';

const Sidebar: FC = () => {
  const { updatePathway } = usePathwaysContext();
  const { pathway, pathwayRef } = useCurrentPathwayContext();
  const { currentNode, currentNodeRef } = useCurrentNodeContext();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const styles = useStyles();
  const history = useHistory();
  const sidebarContainerElement = useRef<HTMLDivElement>(null);

  const toggleSidebar = useCallback((): void => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const changeNodeType = useCallback(
    (nodeType: string): void => {
      if (currentNodeRef.current?.key && pathwayRef.current)
        updatePathway(setNodeType(pathwayRef.current, currentNodeRef.current.key, nodeType));
    },
    [pathwayRef, updatePathway, currentNodeRef]
  );

  const selectNodeType = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      changeNodeType(event?.target.value || '');
    },
    [changeNodeType]
  );

  const addPathwayNode = useCallback((): void => {
    if (!currentNodeRef.current?.key || !pathwayRef.current) return;

    const newNode = createNode();
    let newPathway = addNode(pathwayRef.current, newNode);
    newPathway = addTransition(newPathway, currentNodeRef.current.key, newNode.key as string);
    updatePathway(newPathway);
    if (!isBranchNode(currentNodeRef.current) && newNode.key)
      redirect(pathwayRef.current.id, newNode.key, history);
  }, [pathwayRef, updatePathway, currentNodeRef, history]);

  if (!pathway) return <div>Error: No pathway</div>;
  if (!currentNode) return <div>Error: No current node</div>;

  if (currentNode.key === 'Start') {
    return (
      <>
        {isExpanded && (
          <div className={styles.root} ref={sidebarContainerElement}>
            <SidebarHeader node={currentNode} isTransition={false} />
            <h5 className={styles.dividerHeader}>
              <></>{' '}
            </h5>
            <SidebarButton
              buttonName="Add Node"
              buttonIcon={faPlus}
              buttonText="Add a new transition to a new node in the pathway."
              onClick={addPathwayNode}
            />
          </div>
        )}

        <div className={styles.toggleSidebar} onClick={toggleSidebar}>
          <FontAwesomeIcon icon={isExpanded ? faChevronLeft : faChevronRight} />
        </div>
        <DeleteSnackbar />
      </>
    );
  } else {
    const nodeType = getNodeType(currentNode);
    const displayTransitions =
      currentNode.key !== undefined &&
      (currentNode.key !== 'Start' || currentNode.transitions.length === 0);

    return (
      <>
        {isExpanded && (
          <div className={styles.root} ref={sidebarContainerElement}>
            <SidebarHeader node={currentNode} isTransition={false} />

            <h5 className={styles.dividerHeader}>
              <span>Details</span>
            </h5>

            {nodeType === 'null' && (
              <DropDown
                id="nodeType"
                label="Node Type"
                options={nodeTypeOptions}
                onChange={selectNodeType}
                value=""
              />
            )}

            {nodeType === 'action' && <ActionNodeEditor changeNodeType={changeNodeType} />}

            {nodeType === 'branch' && (
              <DropDown
                id="nodeType"
                label="Node Type"
                options={nodeTypeOptions}
                onChange={selectNodeType}
                value="Observation"
              />
            )}

            <h5 className={styles.dividerHeader}>
              <span>Transitions</span>
            </h5>

            {currentNode?.transitions.map(transition => {
              return (
                <TransitionEditor key={transition.id} transition={transition}>
                  {nodeType === 'branch' && (
                    <BranchTransition key={transition.id} transition={transition} />
                  )}
                </TransitionEditor>
              );
            })}

            {displayTransitions && (
              <>
                <SidebarButton
                  buttonName="Add New Node"
                  buttonIcon={faPlus}
                  buttonText="Add a new transition to a new node in the pathway."
                  onClick={addPathwayNode}
                />
                <ConnectNodeButton />
              </>
            )}
          </div>
        )}
        <div className={styles.toggleSidebar} onClick={toggleSidebar}>
          <FontAwesomeIcon icon={isExpanded ? faChevronLeft : faChevronRight} />
        </div>
        <DeleteSnackbar />
      </>
    );
  }
};

export default memo(Sidebar);
