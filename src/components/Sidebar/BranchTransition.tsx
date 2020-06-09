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

function usePrevious(value: any) {
  const ref = useRef<any>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
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
  const prevCriteriaDisplay = usePrevious(criteriaDisplay);
  const prevTransitionKey = usePrevious(transitionKey);
  const prevNodeKey = usePrevious(currentNodeKey);
  const prevPathway = usePrevious(pathway);
  const savedCriteriaDisplay = React.useRef<string>();

  const handleUseCriteria = useCallback((): void => {
    setUseSelected(!useSelected);
  }, [useSelected]);

  const selectCriteriaSource = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      if (!currentNodeKey || !transition.id) return;

      const criteriaSource = event?.target.value || '';
      updatePathway(setTransitionCriteria(pathway, criteriaSource, transitionKey, currentNodeKey));
    },
    [transition.id, transitionKey, currentNodeKey, updatePathway, pathway]
  );

  const updateCriteriaDisplay = (event: ChangeEvent<{ value: string }>): void => {
    savedCriteriaDisplay.current = event?.target.value || '';
    setCriteriaDisplay(event?.target.value);
  };
  console.log(
    'criteriaDisplay prev: ' + prevCriteriaDisplay + '. and current:' + criteriaDisplay + '.'
  );
  useEffect(() => {
    console.log('component mount');
    return () => {
      console.log('component unmount');
      console.log('temp: ' + savedCriteriaDisplay.current + '.');
      console.log(
        'previous values ' + prevPathway + ' ' + prevNodeKey + ' -> ' + prevTransitionKey
      );
      console.log('current values ' + pathway + ' ' + currentNodeKey + ' -> ' + transitionKey);
      if (pathway && transitionKey && currentNodeKey) {
        console.log(
          'updating pathway prev: ' +
            prevCriteriaDisplay +
            '. and current:' +
            criteriaDisplay +
            '. saved:' +
            savedCriteriaDisplay.current +
            '.'
        );
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
  }, []);

  useEffect(() => {
    console.log('component transition update');
    console.log('previous values ' + prevPathway + ' ' + prevNodeKey + ' -> ' + prevTransitionKey);
    if (prevPathway && prevTransitionKey && prevNodeKey) {
      console.log(
        'updating pathway prev: ' + prevCriteriaDisplay + '. and current:' + criteriaDisplay + '.'
      );
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
  }, [transition]);

  // useEffect(() => {
  //   console.log('component currentNodeKey update');
  //   console.log('previous values ' + prevPathway + ' ' + prevNodeKey + ' -> ' + prevTransitionKey);
  //   if (prevPathway && prevTransitionKey && prevNodeKey) {
  //     console.log(
  //       'updating pathway prev: ' + prevCriteriaDisplay + '. and current:' + criteriaDisplay + '.'
  //     );
  //     updatePathway(
  //       setTransitionCriteriaDisplay(
  //         prevPathway,
  //         prevCriteriaDisplay || '',
  //         prevTransitionKey,
  //         prevNodeKey
  //       )
  //     );
  //   }
  //   setCriteriaDisplay(transition.criteriaDisplay || '');
  // }, [currentNodeKey]);

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
