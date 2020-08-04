import React, {
  FC,
  memo,
  useCallback,
  useState,
  useEffect,
  useRef,
  RefObject,
  ChangeEvent
} from 'react';
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
  SidebarButton,
  TransitionEditor,
  BranchTransition
} from 'components/Sidebar';
import { setNodeType, addTransition, createNode, addNode, getNodeType } from 'utils/builder';
import { usePathwaysContext } from 'components/PathwaysProvider';
import useStyles from './styles';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';
import { useCurrentNodeContext } from 'components/CurrentNodeProvider';
import { isBranchNode, redirect, getConnectableNodes } from 'utils/nodeUtils';
import { nodeTypeOptions } from 'utils/nodeUtils';
import DropDown from 'components/elements/DropDown';
import DeleteSnackbar from './DeleteSnackbar';
import { Button } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { Pathway, PathwayNode } from 'pathways-model';

interface SidebarProps {
  headerElement: RefObject<HTMLDivElement>;
}

interface ConnectNodeButtonProps {
  pathway: Pathway;
  rootNode: PathwayNode;
}

const ConnectNodeButton: FC<ConnectNodeButtonProps> = ({ pathway, rootNode }) => {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const { updatePathway } = usePathwaysContext();

  const options = getConnectableNodes(pathway, rootNode);
  const optionsAvailable = options.length > 0;

  const connectToNode = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      const nodeKey = event?.target.value;
      if (pathway && rootNode) updatePathway(addTransition(pathway, rootNode.key ?? '', nodeKey));
      setOpen(false);
    },
    [pathway, rootNode, updatePathway]
  );

  const showDropdown = useCallback(() => {
    if (optionsAvailable) setOpen(true);
  }, [optionsAvailable]);

  return (
    <div>
      {!open && (
        <Tooltip
          title="There are no possible nodes to connect to."
          open={!optionsAvailable}
          placement="top"
        >
          <SidebarButton
            buttonName="Connect Node"
            buttonIcon={faLevelDownAlt}
            buttonText="Create a transition to an existing node in the pathway."
            onClick={showDropdown}
          />
        </Tooltip>
      )}
      {open && optionsAvailable && (
        <div className={styles.connectDropdown}>
          <DropDown
            id="transitions"
            label="Node To Connect To"
            options={options}
            onChange={connectToNode}
          />
          <div className={styles.connectText}>
            Select node from list or click node on the right to add transition.
            <Button
              className={styles.cancelButtonDropdown}
              size="small"
              variant="text"
              onClick={(): void => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

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

        <DeleteSnackbar />
      </>
    );
  } else {
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
                <ConnectNodeButton pathway={pathway} rootNode={currentNode} />
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
