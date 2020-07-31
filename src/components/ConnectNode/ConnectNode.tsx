import React, { FC, useState } from 'react';
import { SidebarButton } from 'components/Sidebar';
import DropDown from 'components/elements/DropDown';
import { Pathway, PathwayNode } from 'pathways-model';

import { faLevelDownAlt } from '@fortawesome/free-solid-svg-icons';

interface ConnectNodeButtonProps {
	pathway: Pathway;
	rootNode: PathwayNode;
}

const getAncestorNodes = (pathway: Pathway, rootNode: PathwayNode, currNode: PathwayNode): Array<PathwayNode> => {

	let ancestors: Array<PathwayNode> = []
	let previousNodes: Array<PathwayNode> = []

	if (currNode.transitions.length === 0) return []

	for (let transition of currNode.transitions) {
		if (transition.transition === rootNode.key) ancestors.push(currNode)
		else {
			previousNodes = getAncestorNodes(pathway, rootNode, pathway.nodes[transition.transition])
			if (previousNodes !== undefined && previousNodes.length > 0) {
				if (! (ancestors.some(node => node === currNode))) ancestors.push(currNode)
				ancestors = ancestors.concat(previousNodes)
			} 
		}
	}

	return ancestors
};

const getConnectableNodes: any = (pathway: Pathway, rootNode: PathwayNode): Array<{label: string, value: PathwayNode}> => {

	const connectableNodes: Array<{label: string, value: PathwayNode}> = [];
	const previousNodes = getAncestorNodes(pathway, rootNode, pathway.nodes['Start']);
	previousNodes.push(rootNode)
	
	for (let nodeKey of Object.keys(pathway.nodes)) {
	 	const currNode = pathway.nodes[nodeKey]
	 	if (!previousNodes.some(node => node.key === currNode.key)) connectableNodes.push({label: currNode.label, value: currNode})
	}

	return (
		connectableNodes
	);
};

const ConnectNodeButton: FC<ConnectNodeButtonProps> = ({ pathway, rootNode }) => {
	const [open, setOpen] = useState(false);
	const options = getConnectableNodes(pathway, rootNode)
	console.log(options)
	
	return (
		<div>
			{!open && (
				<SidebarButton 
					buttonName="Connect Node"
      		buttonIcon={faLevelDownAlt}
      		buttonText="Create a transition to an existing node in the pathway."
      		onClick={(): void => {setOpen(true)}}
				/>
			)}
			{open && (
        <DropDown
          id="transitions"
         	label="Node To Connect To"
          options={options}
          onChange={(): void => {}}
          value={undefined}
        />
			)}
		</div>
	);
};

export default ConnectNodeButton;