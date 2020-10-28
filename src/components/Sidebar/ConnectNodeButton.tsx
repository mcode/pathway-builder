import React, { useState, memo, useCallback, FC } from 'react';
import { SidebarButton } from 'components/Sidebar';
import DropDown from 'components/elements/DropDown';
import useStyles from './styles';
import { addTransition } from 'utils/builder';
import { getConnectableNodes } from 'utils/nodeUtils';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';

import { faLevelDownAlt } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@material-ui/core';
import { PathwayNode } from 'pathways-model';
import { useParams } from 'react-router-dom';

interface ConnectNodeButtonProps {
  currentNode: PathwayNode | null;
}

const ConnectNodeButton: FC<ConnectNodeButtonProps> = ({ currentNode }) => {
  const { pathway, pathwayRef, setCurrentPathway } = useCurrentPathwayContext();
  const { nodeId } = useParams();
  const currentNodeId = decodeURIComponent(nodeId);
  const currentNodeStatic = pathway?.nodes[currentNodeId];

  const styles = useStyles();
  const [open, setOpen] = useState(false);

  const options: Array<{ label: string; value: string }> =
    currentNode && pathway ? getConnectableNodes(pathway, currentNode) : [];
  const optionsAvailable = options.length > 0;

  const connectToNode = useCallback(
    (nodeKey: string): void => {
      if (pathwayRef.current && currentNodeStatic)
        setCurrentPathway(addTransition(pathwayRef.current, currentNodeStatic.key, nodeKey));
      setOpen(false);
    },
    [setCurrentPathway, currentNodeStatic, pathwayRef]
  );

  const showDropdown = useCallback(() => {
    setOpen(!open);
  }, [open]);

  return (
    <div>
      {!open && (
        <SidebarButton
          buttonName="Connect Node"
          buttonIcon={faLevelDownAlt}
          buttonText="Create a transition to an existing node in the pathway."
          onClick={showDropdown}
          disabled={!optionsAvailable}
          hasTooltip={!optionsAvailable}
          tooltipTitle="There are no possible nodes to connect to."
        />
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
            Select node from list to add transition.
            <Button
              className={styles.cancelButtonDropdown}
              size="small"
              variant="text"
              onClick={showDropdown}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ConnectNodeButton);
