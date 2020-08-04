import React, { useState, memo, useCallback, ChangeEvent, FC } from 'react';
import { SidebarButton } from 'components/Sidebar';
import DropDown from 'components/elements/DropDown';
import useStyles from './styles';
import { addTransition } from 'utils/builder';
import { usePathwaysContext } from 'components/PathwaysProvider';
import { getConnectableNodes } from 'utils/nodeUtils';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';
import { useCurrentNodeContext } from 'components/CurrentNodeProvider';

import { faLevelDownAlt } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

const ConnectNodeButton: FC = () => {
  const { pathway, pathwayRef } = useCurrentPathwayContext();
  const { currentNode, currentNodeRef } = useCurrentNodeContext();
  const { updatePathway } = usePathwaysContext();

  const styles = useStyles();
  const [open, setOpen] = useState(false);

  let options: Array<{ label: string; value: string }> = [];
  if (currentNode && pathway) options = getConnectableNodes(pathway, currentNode);
  const optionsAvailable = options.length > 0;

  const connectToNode = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      const nodeKey = event?.target.value;
      if (pathwayRef.current && currentNodeRef.current)
        updatePathway(addTransition(pathwayRef.current, currentNodeRef.current.key ?? '', nodeKey));
      setOpen(false);
    },
    [updatePathway, currentNodeRef, pathwayRef]
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

export default memo(ConnectNodeButton);
