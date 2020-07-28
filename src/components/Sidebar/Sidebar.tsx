import React, { FC, memo, useCallback, useState, useEffect, useRef, RefObject } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faPlus,
  faLevelDownAlt
} from '@fortawesome/free-solid-svg-icons';

import {
  SidebarHeader,
  ActionNodeEditor,
  BranchNodeEditor,
  NullNodeEditor,
  SidebarButton
} from 'components/Sidebar';
import { setNodeType, addTransition, createNode, addNode, getNodeType } from 'utils/builder';
import { usePathwaysContext } from 'components/PathwaysProvider';
import useStyles from './styles';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';
import { useCurrentNodeContext } from 'components/CurrentNodeProvider';
import { isBranchNode } from 'utils/nodeUtils';

interface SidebarProps {
  headerElement: RefObject<HTMLDivElement>;
}

const Sidebar: FC<SidebarProps> = ({ headerElement }) => {
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

  const redirectToNode = useCallback(
    (nodeKey: string | undefined) => {
      if (!pathwayRef.current || !nodeKey) return;

      const url = `/builder/${encodeURIComponent(pathwayRef.current.id)}/node/${encodeURIComponent(
        nodeKey
      )}`;
      if (url !== history.location.pathname) {
        history.push(url);
      }
    },
    [history, pathwayRef]
  );

  const addPathwayNode = useCallback((): void => {
    if (!currentNodeRef.current?.key || !pathwayRef.current) return;

    const newNode = createNode();
    let newPathway = addNode(pathwayRef.current, newNode);
    newPathway = addTransition(newPathway, currentNodeRef.current.key, newNode.key as string);
    updatePathway(newPathway);
    if (!isBranchNode(currentNodeRef.current)) redirectToNode(newNode.key);
  }, [pathwayRef, updatePathway, currentNodeRef, redirectToNode]);

  const connectToNode = useCallback((): void => {
    console.log('Connect to existing node');
  }, []);

  // Set the height of the sidebar container
  useEffect(() => {
    const resize = (): void => {
      if (sidebarContainerElement?.current && headerElement?.current)
        sidebarContainerElement.current.style.height =
          window.innerHeight - headerElement.current.clientHeight + 'px';
    };
    resize();
    window.addEventListener('resize', resize);
    return (): void => window.removeEventListener('resize', resize);
  }, [isExpanded, headerElement]);

  if (!pathway) return <div>Error: No pathway</div>;
  if (!currentNode) return <div>Error: No current node</div>;

  const nodeType = getNodeType(pathway, currentNode.key);
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

          {nodeType === 'null' && <NullNodeEditor changeNodeType={changeNodeType} />}

          {nodeType === 'action' && <ActionNodeEditor changeNodeType={changeNodeType} />}

          {nodeType === 'branch' && <BranchNodeEditor changeNodeType={changeNodeType} />}

          {displayTransitions && (
            <>
              <SidebarButton
                buttonName="Add New Node"
                buttonIcon={faPlus}
                buttonText="Add a new transition to a new node in the pathway."
                onClick={addPathwayNode}
              />

              <SidebarButton
                buttonName="Connect Node"
                buttonIcon={faLevelDownAlt}
                buttonText="Create a transition to an existing node in the pathway."
                onClick={connectToNode}
              />
            </>
          )}
        </div>
      )}

      <div className={styles.toggleSidebar} onClick={toggleSidebar}>
        <FontAwesomeIcon icon={isExpanded ? faChevronLeft : faChevronRight} />
      </div>
    </>
  );
};

export default memo(Sidebar);
