import React, { FC, ReactNode, memo } from 'react';
import SidebarHeader from './SidebarHeader';
import useStyles from './styles';
import { Card } from '@material-ui/core';
import { Transition } from 'pathways-model';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';

interface TransitionEditorProps {
  transition: Transition;
  children?: ReactNode;
}

const TransitionEditor: FC<TransitionEditorProps> = ({ transition, children }) => {
  const styles = useStyles();
  const { pathway } = useCurrentPathwayContext();
  const transitionKey = transition?.transition || '';
  const transitionNode = pathway?.nodes[transitionKey];

  return (
    <Card raised className={styles.transitionContainer}>
      {transitionNode && <SidebarHeader node={transitionNode} isTransition />}

      {children}
    </Card>
  );
};

export default memo(TransitionEditor);
