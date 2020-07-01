import React, { FC, memo, useCallback, useState, useEffect, useRef, RefObject } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { SidebarHeader, BranchNode, ActionNode, NullNode } from '.';
import { PathwayNode, PathwayActionNode, PathwayBranchNode, Pathway } from 'pathways-model';
import { setNodeNodeType, addTransition, createNode, addNode, getNodeType } from 'utils/builder';
import { usePathwayContext } from 'components/PathwayProvider';
import useStyles from './styles';

interface SidebarProps {
  pathway: Pathway;
  headerElement: RefObject<HTMLDivElement>;
  currentNode: PathwayActionNode | PathwayBranchNode | PathwayNode;
}

const Sidebar: FC<SidebarProps> = ({ pathway, headerElement, currentNode }) => {
  const { updatePathway } = usePathwayContext();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const styles = useStyles();
  const history = useHistory();
  const sidebarContainerElement = useRef<HTMLDivElement>(null);
  const currentNodeKey = currentNode?.key;

  const toggleSidebar = useCallback((): void => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const changeNodeType = useCallback(
    (nodeType: string): void => {
      if (currentNodeKey) updatePathway(setNodeNodeType(pathway, currentNodeKey, nodeType));
    },
    [pathway, updatePathway, currentNodeKey]
  );

  const redirectToNode = useCallback(
    nodeKey => {
      const url = `/builder/${encodeURIComponent(pathway.id)}/node/${encodeURIComponent(nodeKey)}`;
      if (url !== history.location.pathname) {
        history.push(url);
      }
    },
    [history, pathway.id]
  );

  const addPathwayNode = useCallback(
    (nodeType: string): void => {
      if (!currentNodeKey) return;

      const newNode = createNode();
      let newPathway = addNode(pathway, newNode);
      newPathway = addTransition(newPathway, currentNodeKey, newNode.key as string);
      newPathway = setNodeNodeType(newPathway, newNode.key as string, nodeType);
      updatePathway(newPathway);
      redirectToNode(newNode.key);
    },
    [pathway, updatePathway, currentNodeKey, redirectToNode]
  );

  // Set the height of the sidebar container
  useEffect(() => {
    if (sidebarContainerElement?.current && headerElement?.current)
      sidebarContainerElement.current.style.height =
        window.innerHeight - headerElement.current.clientHeight + 'px';
  }, [isExpanded, headerElement]);

  const nodeType = getNodeType(pathway, currentNodeKey);
  return (
    <>
      {isExpanded && (
        <div className={styles.root} ref={sidebarContainerElement}>
          <SidebarHeader pathway={pathway} currentNode={currentNode} isTransition={false} />

          <hr className={styles.divider} />

          {nodeType === 'null' && (
            <NullNode
              pathway={pathway}
              currentNode={currentNode}
              changeNodeType={changeNodeType}
              addNode={addPathwayNode}
            />
          )}

          {nodeType === 'action' && (
            <ActionNode
              pathway={pathway}
              currentNode={currentNode as PathwayActionNode}
              changeNodeType={changeNodeType}
              addNode={addPathwayNode}
            />
          )}

          {nodeType === 'branch' && (
            <BranchNode
              pathway={pathway}
              currentNode={currentNode}
              changeNodeType={changeNodeType}
            />
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
