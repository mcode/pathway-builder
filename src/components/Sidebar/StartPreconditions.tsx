import React, { FC, memo, useCallback, ChangeEvent, useMemo } from 'react';

import { SidebarButton } from 'components/Sidebar';
import useStyles from './styles';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';
import { useCurrentNodeContext } from 'components/CurrentNodeProvider';
import { usePathwaysContext } from 'components/PathwaysProvider';
import DropDown from 'components/elements/DropDown';

interface StartPreconditionsProps {}

const StartPreconditions: FC<StartPreconditionsProps> = ({}) => {
  const { pathway, pathwayRef } = useCurrentPathwayContext();
  const { currentNode, currentNodeRef } = useCurrentNodeContext();
  const { updatePathway } = usePathwaysContext();

  // TODO: We only want to allow pathways that are not this pathway and not included already
  const { pathways } = usePathwaysContext();
  const pathwaysOptions = useMemo(() => pathways.map(c => ({ value: c.id, label: c.name })), [
    pathways
  ]);

  const addPrecondition = useCallback((): void => {
    if (
      !currentNodeRef.current?.key ||
      !pathwayRef.current ||
      currentNodeRef.current.key != 'Start'
    )
      return;

    // Add Precondition to start node

    // Update pathway
    let newPathway = pathwayRef.current;
    updatePathway(newPathway);
  }, [pathwayRef, updatePathway, currentNodeRef]);

  const selectPrecondition = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (
        !currentNodeRef.current?.key ||
        !pathwayRef.current ||
        currentNodeRef.current.key != 'Start'
      )
        return;
      // Add Precondition to start node

      // Update pathway
      let newPathway = pathwayRef.current;
      updatePathway(newPathway);
    },
    [pathwayRef, updatePathway, currentNodeRef]
  );

  // For each precondition need a dropdown and need to add a delete button
  // Need to add a blank dropdown whenever add is clicked
  return (
    <div>
      <DropDown
        id="Precondition"
        label="Precondition"
        options={pathwaysOptions}
        onChange={selectPrecondition}
        value={undefined}
      />
      <DropDown
        id="Precondition"
        label="Precondition"
        options={pathwaysOptions}
        onChange={selectPrecondition}
        value={undefined}
      />
      <SidebarButton
        buttonName="Add Pre-Condition"
        buttonIcon={faPlus}
        buttonText="Add a new pre-condition pathway to this pathway."
        onClick={addPrecondition}
      />
    </div>
  );
};

export default memo(StartPreconditions);
