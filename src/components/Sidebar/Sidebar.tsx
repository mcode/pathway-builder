import React, { FC, memo, useCallback, useState, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  SidebarHeader,
  ActionNodeEditor,
  SidebarButton,
  TransitionEditor,
  BranchTransition,
  ReferenceNodeEditor
} from 'components/Sidebar';
import { setNodeType, addTransition, createNode, addNode } from 'utils/builder';
import useStyles from './styles';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';
import { isBranchNode, redirect, getNodeType } from 'utils/nodeUtils';
import { nodeTypeOptions } from 'utils/nodeUtils';
import DropDown from 'components/elements/DropDown';
import DeleteSnackbar from './DeleteSnackbar';
import ConnectNodeButton from 'components/Sidebar/ConnectNodeButton';
import { PathwayNode } from 'pathways-model';

interface SidebarProps {
  currentNode: PathwayNode | null;
}

const Sidebar: FC<SidebarProps> = ({ currentNode }) => {
  const { pathway, pathwayRef, setCurrentPathway } = useCurrentPathwayContext();
  const { nodeId } = useParams();
  const currentNodeId = decodeURIComponent(nodeId);
  const currentNodeStatic = pathway?.nodes[currentNodeId];
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const styles = useStyles();
  const history = useHistory();
  const sidebarContainerElement = useRef<HTMLDivElement>(null);

  const toggleSidebar = useCallback((): void => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const changeNodeType = useCallback(
    (nodeType: string): void => {
      if (currentNodeStatic && pathwayRef.current)
        setCurrentPathway(setNodeType(pathwayRef.current, currentNodeStatic.key, nodeType));
    },
    [pathwayRef, setCurrentPathway, currentNodeStatic]
  );

  const addPathwayNode = useCallback((): void => {
    if (!currentNodeStatic || !pathwayRef.current) return;

    const newNode = createNode();
    let newPathway = addNode(pathwayRef.current, newNode);
    newPathway = addTransition(newPathway, currentNodeStatic.key, newNode.key);
    setCurrentPathway(newPathway);
    if (!isBranchNode(currentNodeStatic)) redirect(pathwayRef.current.id, newNode.key, history);
  }, [pathwayRef, setCurrentPathway, currentNodeStatic, history]);

  if (!pathway) return <div>Error: No pathway</div>;
  if (!currentNode) return <div>Error: No current node</div>;

  if (currentNode.type === 'start') {
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
    const displayTransitions = nodeType !== 'start' || currentNode.transitions.length === 0;

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
                onChange={changeNodeType}
                value=""
              />
            )}
            {nodeType === 'reference' && (
              <ReferenceNodeEditor changeNodeType={changeNodeType} currentNode={currentNode} />
            )}
            {nodeType === 'action' && (
              <ActionNodeEditor changeNodeType={changeNodeType} currentNode={currentNode} />
            )}

            {nodeType === 'branch' && (
              <DropDown
                id="nodeType"
                label="Node Type"
                options={nodeTypeOptions}
                onChange={changeNodeType}
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
                    <BranchTransition
                      key={transition.id}
                      transition={transition}
                      currentNode={currentNode}
                    />
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
                <ConnectNodeButton currentNode={currentNode} />
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
