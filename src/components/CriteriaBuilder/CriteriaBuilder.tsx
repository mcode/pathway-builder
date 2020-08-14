import React, { FC, memo, useCallback, useEffect, useState, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { IconButton, TextField } from '@material-ui/core';

import DropDown from 'components/elements/DropDown';
import { useBuildCriteriaContext } from 'components/BuildCriteriaProvider';
import useStyles from './styles';

const CriteriaBuilder: FC = () => {
  const styles = useStyles();
  const { updateBuildCriteriaCql } = useBuildCriteriaContext();
  const [selectedElement, setSelectedElement] = useState<string>('');
  const [selectedDemoElement, setSelectedDemoElement] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [minimumAge, setMinimumAge] = useState<number>(0);
  const [maximumAge, setMaximumAge] = useState<number>(0);
  const elementOptions = [{ value: 'Demographics', label: 'Demographics' }];
  const demoElementOptions = [
    { value: 'Age Range', label: 'Age Range' },
    { value: 'Gender', label: 'Gender' }
  ];
  const genderOptions = [
    {
      label: 'Male',
      value: 'Male'
    },
    {
      label: 'Female',
      value: 'Female'
    },
    {
      label: 'Other',
      value: 'Other'
    },
    {
      label: 'Unknown',
      value: 'Unknown'
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
    setMinimumAge(0);
    setMaximumAge(0);
  }, []);

  const genderString = `The patient's gender is ${gender}`;
  const ageRangeString = `The patient's age is between ${minimumAge} years and ${maximumAge} years`;

  useEffect(() => {
    const cql = `AgeInYears() >= ${minimumAge} and AgeInYears() < ${maximumAge}`;
    if (minimumAge >= 0 && maximumAge > 0) {
      updateBuildCriteriaCql({ cql, text: ageRangeString });
    } else if (minimumAge === 0 && maximumAge === 0) {
      updateBuildCriteriaCql(null);
    }
  }, [minimumAge, maximumAge, ageRangeString, updateBuildCriteriaCql]);

  useEffect(() => {
    const cql = `Patient.gender.value = '${gender}'`;
    if (gender !== '') {
      updateBuildCriteriaCql({ cql, text: genderString });
    } else if (gender === '') {
      updateBuildCriteriaCql(null);
    }
  }, [gender, genderString, updateBuildCriteriaCql]);

  return (
    <>
      <div className={styles.headerText}>
        Specify criteria to identify a target population that should receive a recommendation from
        this artifact. Examples might include an age range, gender, presence of a certain condition,
        or lab results within a specific range.
      </div>
      <div className={styles.elementContainer}>
        {(selectedElement === '' || selectedDemoElement === '') && (
          <div className={styles.elementSelect}>
            <div className={styles.addElementLabel}>
              <FontAwesomeIcon icon={faPlus} /> Add element
            </div>
            <DropDown
              id="Choose Element Type"
              label="Choose Element Type"
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
          </div>
        )}

        {!(selectedElement === '' || selectedDemoElement === '') && (
          <>
            <span>{selectedDemoElement}</span>
            <IconButton onClick={resetElements}>
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
            <hr />
            {selectedDemoElement === 'Gender' && (
              <>
                <span>{genderString}</span>
                <DropDown
                  id="Select Gender"
                  label="Gender"
                  options={genderOptions}
                  onChange={onGenderSelected}
                  value={gender}
                />
              </>
            )}
            {selectedDemoElement === 'Age Range' && (
              <>
                <span>{ageRangeString}</span>
                <div className={styles.elementField}>
                  <span className={styles.elementFieldLabel}>Minimum Age:</span>
                  <TextField type="number" value={minimumAge} onChange={onMinimumAgeChange} />
                </div>
                <div className={styles.elementField}>
                  <span className={styles.elementFieldLabel}>Maximum Age:</span>
                  <TextField type="number" value={maximumAge} onChange={onMaximumAgeChange} />
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
