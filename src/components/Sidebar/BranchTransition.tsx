import React, { FC, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTools } from '@fortawesome/free-solid-svg-icons';

import { SidebarHeader, SidebarButton } from '.';
import { Pathway, Transition } from 'pathways-model';
import useStyles from './styles';

interface BranchTransitionProps {
  pathway: Pathway;
  transition: Transition;
  updatePathway: (pathway: Pathway) => void;
}

const BranchTransition: FC<BranchTransitionProps> = ({ pathway, transition, updatePathway }) => {
  const styles = useStyles();
  const transitionKey = transition?.transition || '';
  const transitionNode = pathway.states[transitionKey];

  return (
    <>
      <hr className={styles.divider} />

      <SidebarHeader
        pathway={pathway}
        currentNode={transitionNode}
        updatePathway={updatePathway}
        isTransition={true}
      />

      <SidebarButton
        buttonName="Use Criteria"
        buttonIcon={<FontAwesomeIcon icon={faPlus} />}
        buttonText="Add previously built or imported criteria logic to branch node."
      />

      <SidebarButton
        buttonName="Build Criteria"
        buttonIcon={<FontAwesomeIcon icon={faTools} />}
        buttonText="Create new criteria logic to add to branch node."
      />
    </>
  );
};

export default memo(BranchTransition);
