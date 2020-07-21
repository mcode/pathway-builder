import React, { FC, memo, useCallback, ChangeEvent } from 'react';

import { BranchTransition } from '.';
import DropDown from 'components/elements/DropDown';
<<<<<<< HEAD
import { addTransition, createNode, addNode } from 'utils/builder';
import { usePathwaysContext } from 'components/PathwaysProvider';
=======
>>>>>>> Support multiple transitions and update designs

import useStyles from './styles';
import { useCurrentNodeContext } from 'components/CurrentNodeProvider';

const nodeTypeOptions = [
  { label: 'Medication', value: 'MedicationRequest' },
  { label: 'Procedure', value: 'ServiceRequest' },
  { label: 'Regimen', value: 'CarePlan' },
  { label: 'Observation', value: 'Observation' }
];

interface BranchNodeEditorProps {
  changeNodeType: (event: string) => void;
}

const BranchNodeEditor: FC<BranchNodeEditorProps> = ({ changeNodeType }) => {
<<<<<<< HEAD
  const { updatePathway } = usePathwaysContext();
  const { pathwayRef } = useCurrentPathwayContext();
  const { currentNode, currentNodeRef } = useCurrentNodeContext();
=======
  const { currentNode } = useCurrentNodeContext();
>>>>>>> Support multiple transitions and update designs
  const styles = useStyles();

  const selectNodeType = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      changeNodeType(event?.target.value || '');
    },
    [changeNodeType]
  );

  return (
    <>
      <DropDown
        id="nodeType"
        label="Node Type"
        options={nodeTypeOptions}
        onChange={selectNodeType}
        value="Observation"
      />

      <h5 className={styles.dividerHeader}>
        <span>Transitions</span>
      </h5>

      {currentNode?.transitions.map(transition => {
        return <BranchTransition key={transition.id} transition={transition} />;
      })}
    </>
  );
};

export default memo(BranchNodeEditor);
