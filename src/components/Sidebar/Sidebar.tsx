import React, { FC, memo, useCallback, useState, useRef, ChangeEvent } from 'react';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  SidebarHeader,
  ActionNodeEditor,
  SidebarButton,
  TransitionEditor,
  BranchTransition
} from 'components/Sidebar';
import {
  setNodeType,
  addTransition,
  createNode,
  addNode,
  getNodeType,
  setNodeReference
} from 'utils/builder';
import { Link } from '@material-ui/core';
import { usePathwaysContext } from 'components/PathwaysProvider';
import useStyles from './styles';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';
import { useCurrentNodeContext } from 'components/CurrentNodeProvider';
import { isBranchNode, redirect } from 'utils/nodeUtils';
import { nodeTypeOptions } from 'utils/nodeUtils';
import DropDown from 'components/elements/DropDown';
import DeleteSnackbar from './DeleteSnackbar';
import ConnectNodeButton from 'components/Sidebar/ConnectNodeButton';
import { Pathway, ReferenceNode } from 'pathways-model';

const Sidebar: FC = () => {
  const { pathways, updatePathway } = usePathwaysContext();
  const { pathway, pathwayRef, setPathway } = useCurrentPathwayContext();
  const { currentNode, currentNodeRef } = useCurrentNodeContext();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const styles = useStyles();
  const history = useHistory();
  const sidebarContainerElement = useRef<HTMLDivElement>(null);
  const pathwayOptions = pathways.map((pathway: Pathway) => {
    return {
      label: pathway.name,
      value: pathway.id
    };
  });

  const toggleSidebar = useCallback((): void => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const showReference = useCallback((): void => {
    console.log('clicky');
    const pathwayReferenceId = (currentNode as ReferenceNode).referenceId;
    const referencedPathway = pathways.find(pathway => {
      return pathway.id === pathwayReferenceId;
    });
    if (referencedPathway) {
      setPathway(referencedPathway);
    }
  }, [currentNode, pathways, setPathway]);
  const changeNodeType = useCallback(
    (nodeType: string): void => {
      if (currentNodeRef.current && pathwayRef.current)
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

  const selectPathwayReference = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      const referenceId = event?.target.value || '';
      const referenceLabel =
        pathwayOptions.find(option => {
          return option.value === referenceId;
        })?.label || '';
      if (currentNodeRef.current && pathwayRef.current)
        updatePathway(
          setNodeReference(
            pathwayRef.current,
            currentNodeRef.current.key,
            referenceId,
            referenceLabel
          )
        );
    },
    [currentNodeRef, pathwayOptions, pathwayRef, updatePathway]
  );
  const addPathwayNode = useCallback((): void => {
    if (!currentNodeRef.current || !pathwayRef.current) return;

    const newNode = createNode();
    let newPathway = addNode(pathwayRef.current, newNode);
    newPathway = addTransition(newPathway, currentNodeRef.current.key, newNode.key);
    updatePathway(newPathway);
    if (!isBranchNode(currentNodeRef.current))
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
    const displayTransitions = currentNode.key !== 'Start' || currentNode.transitions.length === 0;

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
            {nodeType === 'reference' && (
              <div>
                <DropDown
                  id="nodeType"
                  label="Node Type"
                  options={nodeTypeOptions}
                  onChange={selectNodeType}
                  value="Reference"
                />
                <div className={styles.referenceDropdown}>
                  <DropDown
                    id="reference"
                    label="Pathway Reference"
                    options={pathwayOptions}
                    onChange={selectPathwayReference}
                    value={(currentNode as ReferenceNode).referenceId}
                  />
                  <div className={styles.referenceChevron}>
                    <Link
                      component={RouterLink}
                      to={`/builder/${encodeURIComponent(
                        (currentNode as ReferenceNode).referenceId
                      )}`}
                      color="inherit"
                      underline="none"
                      onClick={showReference}
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </Link>
                  </div>
                </div>
              </div>
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
