import React, { FC, memo, useCallback, useState, useEffect, useRef, RefObject } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons';

import { SidebarHeader, SidebarButton, BranchNode, ActionNode } from '.';
import { State, Pathway } from 'pathways-model';
import { setStateNodeType, addTransition, createState, addState } from 'utils/builder';
import useStyles from './styles';

interface SidebarProps {
  pathway: Pathway;
  updatePathway: (pathway: Pathway) => void;
  headerElement: RefObject<HTMLDivElement>;
  currentNode: State;
}

const Sidebar: FC<SidebarProps> = ({ pathway, updatePathway, headerElement, currentNode }) => {
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
      if (currentNodeKey) updatePathway(setStateNodeType(pathway, currentNodeKey, nodeType));
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

  const addNode = useCallback(
    (nodeType: string): void => {
      if (!currentNodeKey) return;

      const newState = createState();
      let newPathway = addState(pathway, newState);
      newPathway = addTransition(newPathway, currentNodeKey, newState.key as string);
      newPathway = setStateNodeType(newPathway, newState.key as string, nodeType);

      updatePathway(newPathway);
      redirectToNode(newState.key);
    },
    [pathway, updatePathway, currentNodeKey, redirectToNode]
  );

  // Set the height of the sidebar container
  useEffect(() => {
    if (sidebarContainerElement?.current && headerElement?.current)
      sidebarContainerElement.current.style.height =
        window.innerHeight - headerElement.current.clientHeight + 'px';
  }, [isExpanded, headerElement]);

  return (
    <>
      {isExpanded && (
        <div className={styles.root} ref={sidebarContainerElement}>
          <SidebarHeader
            pathway={pathway}
            currentNode={currentNode}
            updatePathway={updatePathway}
          />

          <hr className={styles.divider} />

          {(!currentNode.nodeType || currentNode.nodeType === '') && (
            <>
              <SidebarButton
                buttonName="Add Action Node"
                buttonIcon={<FontAwesomeIcon icon={faPlus} />}
                buttonText="Any clinical or workflow step which is not a decision."
                onClick={(): void => addNode('action')}
              />

              <SidebarButton
                buttonName="Add Branch Node"
                buttonIcon={<FontAwesomeIcon icon={faPlus} />}
                buttonText="A logical branching point based on clinical or workflow criteria."
                onClick={(): void => addNode('branch')}
              />
            </>
          )}

          {currentNode.nodeType === 'action' && (
            <ActionNode
              pathway={pathway}
              currentNode={currentNode}
              changeNodeType={changeNodeType}
            />
          )}

          {currentNode.nodeType === 'branch' && (
            <BranchNode
              pathway={pathway}
              currentNode={currentNode}
              changeNodeType={changeNodeType}
              updatePathway={updatePathway}
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
