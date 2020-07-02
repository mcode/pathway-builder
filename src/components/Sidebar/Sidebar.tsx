import React, { FC, memo, useCallback, useState, useEffect, useRef, RefObject } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons';

import { SidebarHeader, BranchNodeEditor, ActionNodeEditor, NullNode, SidebarButton } from '.';
import { setNodeNodeType, addTransition, createNode, addNode, getNodeType } from 'utils/builder';
import { usePathwayContext } from 'components/PathwayProvider';
import useStyles from './styles';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';
import { useCurrentNodeContext } from 'components/CurrentNodeProvider';

interface SidebarProps {
  headerElement: RefObject<HTMLDivElement>;
}

const Sidebar: FC<SidebarProps> = ({ headerElement }) => {
  const { updatePathway } = usePathwayContext();
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
        updatePathway(setNodeNodeType(pathwayRef.current, currentNodeRef.current.key, nodeType));
    },
    [pathwayRef, updatePathway, currentNodeRef]
  );

  const redirectToNode = useCallback(
    nodeKey => {
      if (!pathwayRef.current) return;

      const url = `/builder/${encodeURIComponent(pathwayRef.current.id)}/node/${encodeURIComponent(
        nodeKey
      )}`;
      if (url !== history.location.pathname) {
        history.push(url);
      }
    },
    [history, pathwayRef]
  );

  const addPathwayNode = useCallback(
    (nodeType: string): void => {
      if (!currentNodeRef.current?.key || !pathwayRef.current) return;

      const newNode = createNode();
      let newPathway = addNode(pathwayRef.current, newNode);
      newPathway = addTransition(newPathway, currentNodeRef.current.key, newNode.key as string);
      newPathway = setNodeNodeType(newPathway, newNode.key as string, nodeType);
      updatePathway(newPathway);
      redirectToNode(newNode.key);
    },
    [pathwayRef, updatePathway, currentNodeRef, redirectToNode]
  );

  const addBranchNode = useCallback((): void => addPathwayNode('branch'), [addPathwayNode]);

  const addActionNode = useCallback((): void => addPathwayNode('action'), [addPathwayNode]);

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
  // If the node does not have transitions it can be added to
  const displayAddButtons = currentNode.key !== undefined && currentNode.transitions.length === 0;
  return (
    <>
      {isExpanded && (
        <div className={styles.root} ref={sidebarContainerElement}>
          <SidebarHeader node={currentNode} isTransition={false} />

          <hr className={styles.divider} />

          {nodeType === 'null' && <NullNode changeNodeType={changeNodeType} />}

          {nodeType === 'action' && <ActionNodeEditor changeNodeType={changeNodeType} />}

          {nodeType === 'branch' && <BranchNodeEditor changeNodeType={changeNodeType} />}

          {displayAddButtons && (
            <>
              {currentNode.key !== 'Start' && <hr className={styles.divider} />}
              <SidebarButton
                buttonName="Add Action Node"
                buttonIcon={faPlus}
                buttonText="Any clinical or workflow step which is not a decision."
                onClick={addActionNode}
              />

              <SidebarButton
                buttonName="Add Branch Node"
                buttonIcon={faPlus}
                buttonText="A logical branching point based on clinical or workflow criteria."
                onClick={addBranchNode}
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
