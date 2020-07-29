import React, { FC, memo, useCallback, useState, useMemo, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@material-ui/core';

import DropDown from 'components/elements/DropDown';
import useStyles from './styles';

const CriteriaBuilder: FC = () => {
  const styles = useStyles();
  const [selectedElement, setSelectedElement] = useState<string>('');
  const [selectedDemoElement, setSelectedDemoElement] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [minimumAge, setMinimumAge] = useState<number>(0);
  const [maximumAge, setMaximumAge] = useState<number>(0);
  const elementOptions = [{ value: 'demographics', label: 'Demographics' }];
  const demoElementOptions = [
    { value: 'age range', label: 'Age Range' },
    { value: 'gender', label: 'Gender' }
  ];
  const genderOptions = [
    {
      label: 'Male',
      value: 'male'
    },
    {
      label: 'Female',
      value: 'female'
    },
    {
      label: 'Other',
      value: 'other'
    },
    {
      label: 'Unknown',
      value: 'unknown'
    }
  ];

  const onElementSelected = useCallback((event: ChangeEvent<{ value: string }>): void => {
    setSelectedElement(event?.target.value || '');
  }, []);

  const onDemoElementSelected = useCallback((event: ChangeEvent<{ value: string }>): void => {
    setSelectedDemoElement(event?.target.value || '');
  }, []);

  const onGenderSelected = useCallback((event: ChangeEvent<{ value: string }>): void => {
    setGender(event?.target.value || '');
  }, []);

  const onMinimumAgeChange = useCallback((event: ChangeEvent<{ value: string }>): void => {
    setMinimumAge(parseInt(event?.target.value) || 0);
  }, []);

  const onMaximumAgeChange = useCallback((event: ChangeEvent<{ value: string }>): void => {
    setMaximumAge(parseInt(event?.target.value) || 0);
  }, []);

  const resetElements = useCallback(() => {
    setSelectedElement('');
    setSelectedDemoElement('');
    setGender('');
  }, []);

  const ageCql: string = useMemo((): string => {
    return `AgeInYears() >= ${minimumAge} and AgeInYears() < ${maximumAge}`;
  }, [minimumAge, maximumAge]);

  const genderCql: string = useMemo((): string => {
    return `Patient.gender.value = '${gender}'`;
  }, [gender]);

  return (
    <>
      <div className={styles.headerText}>
        Specify criteria to identify a target population that should receive a recommendation from
        this artifact. Examples might include an age range, gender, presence of a certain condition,
        or lab results within a specific range.
      </div>
      <div className={styles.elementContainer}>
        {(selectedElement === '' || selectedDemoElement === '') && (
          <>
            <FontAwesomeIcon icon={faPlus} /> Add element
            <DropDown
              id="Choose Element"
              label="Choose Element"
              options={elementOptions}
              onChange={onElementSelected}
              value={selectedElement}
            />
            {selectedElement && (
              <DropDown
                id={`Select ${selectedElement} element`}
                label={`Select ${selectedElement} element`}
                options={demoElementOptions}
                onChange={onDemoElementSelected}
                value={selectedDemoElement}
              />
            )}
          </>
        )}

        {!(selectedElement === '' || selectedDemoElement === '') && (
          <>
            <span>{selectedDemoElement}</span>
            <IconButton onClick={resetElements}>
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
            <hr />
            {selectedDemoElement === 'gender' && (
              <DropDown
                id="Select Gender"
                label="Gender"
                options={genderOptions}
                onChange={onGenderSelected}
                value={gender}
              />
            )}
            {selectedDemoElement === 'age range' && (
              <>
                <div>
                  <span>Minimum Age:</span>
                  <input type="number" value={minimumAge} onChange={onMinimumAgeChange} />
                </div>
                <div>
                  <span>Maximum Age:</span>
                  <input type="number" value={maximumAge} onChange={onMaximumAgeChange} />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default memo(CriteriaBuilder);
