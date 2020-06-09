import React, { FC, memo, useState, useCallback, ChangeEvent, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTools } from '@fortawesome/free-solid-svg-icons';
import DropDown from 'components/elements/DropDown';
import { TextField, FormControl } from '@material-ui/core';
import { setTransitionCriteria, setTransitionCriteriaDisplay } from 'utils/builder';
import { SidebarHeader, SidebarButton } from '.';
import { Pathway, Transition } from 'pathways-model';
import useStyles from './styles';

interface BranchTransitionProps {
  pathway: Pathway;
  currentNodeKey: string;
  transition: Transition;
  updatePathway: (pathway: Pathway) => void;
}

const criteriaOptions = [
  { value: 'TumorSize2+', label: 'Tumor Size > 2cm' },
  { value: 'TumorSize2-', label: 'Tumor Size <= 2cm' },
  { value: 'Other', label: 'Other' }
];

function usePreviousString(value: string): string {
  const ref = useRef<string>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current || '';
}

function usePreviousPathway(value: Pathway): Pathway {
  const ref = useRef<Pathway>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current || value;
}

const BranchTransition: FC<BranchTransitionProps> = ({
  pathway,
  currentNodeKey,
  transition,
  updatePathway
}) => {
  const styles = useStyles();
  const transitionKey = transition?.transition || '';
  const transitionNode = pathway.states[transitionKey];
  const [useSelected, setUseSelected] = useState<boolean>(false);
  const [criteriaDisplay, setCriteriaDisplay] = useState(transition.criteriaDisplay || '');
  const prevCriteriaDisplay = usePreviousString(criteriaDisplay);
  const prevTransitionKey = usePreviousString(transitionKey);
  const prevNodeKey = usePreviousString(currentNodeKey);
  const prevPathway = usePreviousPathway(pathway);
  // need to save this value for the component unmount
  const savedCriteriaDisplay = React.useRef<string>();

  const handleUseCriteria = useCallback((): void => {
    setUseSelected(!useSelected);
  }, [useSelected]);

  const selectCriteriaSource = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeKey || !transition.id) return;

      const criteriaSource = event?.target.value || '';
      updatePathway(setTransitionCriteria(pathway, criteriaSource, transitionKey, currentNodeKey));

      // Need to also save the criteria display as the component will reload without saving
      updatePathway(
        setTransitionCriteriaDisplay(
          pathway,
          savedCriteriaDisplay.current || '',
          transitionKey,
          currentNodeKey
        )
      );
    },
    [transition.id, transitionKey, currentNodeKey, updatePathway, pathway]
  );

  const updateCriteriaDisplay = (event: ChangeEvent<{ value: string }>): void => {
    savedCriteriaDisplay.current = event?.target.value || '';
    setCriteriaDisplay(event?.target.value);
  };

  // Save the pathway when this component unmounts
  useEffect(() => {
    return (): void => {
      if (pathway && transitionKey && currentNodeKey) {
        updatePathway(
          setTransitionCriteriaDisplay(
            pathway,
            savedCriteriaDisplay.current || '',
            transitionKey,
            currentNodeKey
          )
        );
      }
    };
    // we only want to save the pathway on componentWillUnMount
    // eslint-disable-next-line
  }, []);

  // Save the pathway when we transition to another branch node
  useEffect(() => {
    if (prevPathway && prevTransitionKey && prevNodeKey) {
      updatePathway(
        setTransitionCriteriaDisplay(
          prevPathway,
          prevCriteriaDisplay || '',
          prevTransitionKey,
          prevNodeKey
        )
      );
    }
    setCriteriaDisplay(transition.criteriaDisplay || '');
    // we only want to save the pathway once
    // eslint-disable-next-line
  }, [transition]);

  return (
    <>
      <hr className={styles.divider} />

      <SidebarHeader
        pathway={pathway}
        currentNode={transitionNode}
        updatePathway={updatePathway}
        isTransition={true}
      />
      {useSelected === false && (
        <SidebarButton
          buttonName="Use Criteria"
          buttonIcon={<FontAwesomeIcon icon={faPlus} />}
          buttonText="Add previously built or imported criteria logic to branch node."
          onClick={handleUseCriteria}
        />
      )}

      {useSelected === true && (
        <>
          <DropDown
            id="Criteria"
            label="Criteria"
            options={criteriaOptions}
            onChange={selectCriteriaSource}
            value={transition.criteria}
          />
          <FormControl variant="outlined" fullWidth>
            <TextField
              label="Criteria display"
              value={criteriaDisplay}
              variant="outlined"
              onChange={updateCriteriaDisplay}
              error={criteriaDisplay === undefined || criteriaDisplay === ''}
            />
          </FormControl>
        </>
      )}

      <SidebarButton
        buttonName="Build Criteria"
        buttonIcon={<FontAwesomeIcon icon={faTools} />}
        buttonText="Create new criteria logic to add to branch node."
      />
    </>
  );
};
export default memo(BranchTransition);
