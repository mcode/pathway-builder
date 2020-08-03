import React, { FC, useState, memo, useCallback, ChangeEvent } from 'react';
import { SidebarButton } from 'components/Sidebar';
import DropDown from 'components/elements/DropDown';
import { Pathway, PathwayNode } from 'pathways-model';
import useStyles from './styles';
import { addTransition } from 'utils/builder';
import { usePathwaysContext } from 'components/PathwaysProvider';

import { faLevelDownAlt } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

interface ConnectNodeButtonProps {
  pathway: Pathway;
  rootNode: PathwayNode;
}

const getAncestorNodes = (
  pathway: Pathway,
  rootNodeKey: string,
  currNodeKey: string
): Array<PathwayNode> => {
  let ancestors: Array<PathwayNode> = [];
  let previousNodes: Array<PathwayNode> = [];
  const currNode = pathway.nodes[currNodeKey];

  for (const transition of currNode.transitions) {
    if (transition.transition === rootNodeKey) ancestors.push(currNode);
    else {
      previousNodes = getAncestorNodes(
        pathway,
        rootNodeKey,
        pathway.nodes[transition.transition].key ?? ''
      );
      if (previousNodes !== undefined && previousNodes.length > 0) {
        if (!ancestors.some(node => node === currNode)) ancestors.push(currNode);
        ancestors = ancestors.concat(previousNodes);
      }
    }
  }

  return ancestors;
};

const getConnectableNodes = (
  pathway: Pathway,
  rootNode: PathwayNode
): Array<{ label: string; value: string }> => {
  const connectableNodes: Array<{ label: string; value: string }> = [];
  const previousNodes = getAncestorNodes(
    pathway,
    rootNode.key ?? '',
    pathway.nodes['Start'].key ?? ''
  );
  previousNodes.push(rootNode);

  for (const nodeKey of Object.keys(pathway.nodes)) {
    const currNode = pathway.nodes[nodeKey];
    if (!rootNode.transitions.some(transition => transition.transition === nodeKey)) {
      if (!previousNodes.some(node => node.key === currNode.key))
        connectableNodes.push({ label: currNode.label, value: currNode.key ?? '' });
    }
  }

  return connectableNodes;
};

const ConnectNodeButton: FC<ConnectNodeButtonProps> = ({ pathway, rootNode }) => {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const options = getConnectableNodes(pathway, rootNode);
  const { updatePathway } = usePathwaysContext();
  const optionsAvailable: boolean = options.length > 0;

  const connectToNode = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      const nodeKey = event?.target.value;
      const newPath = addTransition(pathway, rootNode.key ?? '', nodeKey);
      updatePathway(newPath);
      setOpen(false);
    },
    [pathway, rootNode, updatePathway]
  );

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
            onClick={(): void => {
              optionsAvailable && setOpen(true);
            }}
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
              className={styles.cancelButton}
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
