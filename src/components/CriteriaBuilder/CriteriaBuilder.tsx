import React, { FC, memo, useCallback, useEffect, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { IconButton, TextField } from '@material-ui/core';
import shortid from 'shortid';

import DropDown from 'components/elements/DropDown';
import { useCurrentCriteriaContext } from 'components/CurrentCriteriaProvider';
import useStyles from './styles';
import { useCriteriaBuilderContext } from 'components/CriteriaBuilderProvider';
import { convertBasicCQL } from 'engine/cql-to-elm';

const CriteriaBuilder: FC = () => {
  const {
    selectedElement,
    selectedDemoElement,
    gender,
    minimumAge,
    maximumAge,
    setSelectedElement,
    setSelectedDemoElement,
    setGender,
    setMinimumAge,
    setMaximumAge,
    resetCriteriaBuilder
  } = useCriteriaBuilderContext();
  const styles = useStyles();
  const { setCurrentCriteria } = useCurrentCriteriaContext();
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

  const onMinimumAgeChange = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      setMinimumAge(parseInt(event?.target.value) || 0);
    },
    [setMinimumAge]
  );

  const onMaximumAgeChange = useCallback(
    (event: ChangeEvent<{ value: string }>): void => {
      setMaximumAge(parseInt(event?.target.value) || 0);
    },
    [setMaximumAge]
  );

  const handleClose = useCallback((): void => {
    resetCriteriaBuilder();
    setCurrentCriteria(null);
  }, [resetCriteriaBuilder, setCurrentCriteria]);

  const genderString = `The patient's gender is ${gender}`;
  const ageRangeString = `The patient's age is between ${minimumAge} years and ${maximumAge} years`;

  const createCqlLibrary = useCallback((cqlStatement: string, name: string) => {
    // CQl identifier cannot start with a number or contain '-'
    const cqlId = `cql${shortid.generate().replace(/-/g, 'a')}`;
    const cql = `library ${cqlId} version '1'\nusing FHIR version '4.0.1'\ncontext Patient\n
    define "${name}":\n${cqlStatement}`;

    return cql;
  }, []);

  useEffect(() => {
    const cqlStatement = `AgeInYears() >= ${minimumAge} and AgeInYears() < ${maximumAge}`;
    const cql = createCqlLibrary(cqlStatement, 'age');
    if (selectedDemoElement === 'Age Range') {
      if (minimumAge >= 0 && maximumAge > 0 && minimumAge < maximumAge) {
        convertBasicCQL(cql).then(elm =>
          setCurrentCriteria({
            cql: cql,
            builder: {
              text: ageRangeString,
              type: 'age',
              min: minimumAge,
              max: maximumAge
            },
            elm: elm
          })
        );
      } else {
        setCurrentCriteria(null);
      }
    }
  }, [
    selectedDemoElement,
    minimumAge,
    maximumAge,
    ageRangeString,
    setCurrentCriteria,
    createCqlLibrary
  ]);

  useEffect(() => {
    const cqlStatement = `Patient.gender.value ~ '${gender}'`;
    const cql = createCqlLibrary(cqlStatement, 'gender');
    if (selectedDemoElement === 'Gender') {
      if (gender !== '') {
        convertBasicCQL(cql).then(elm =>
          setCurrentCriteria({
            cql: cql,
            builder: {
              text: genderString,
              type: 'gender',
              gender
            },
            elm: elm
          })
        );
      } else {
        setCurrentCriteria(null);
      }
    }
  }, [selectedDemoElement, gender, genderString, setCurrentCriteria, createCqlLibrary]);

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
              onChange={setSelectedElement}
              value={selectedElement}
            />
            {selectedElement && (
              <DropDown
                id={`Select ${selectedElement} element`}
                label={`Select ${selectedElement} element`}
                options={demoElementOptions}
                onChange={setSelectedDemoElement}
                value={selectedDemoElement}
              />
            )}
          </div>
        )}

        {!(selectedElement === '' || selectedDemoElement === '') && (
          <>
            <span>{selectedDemoElement}</span>
            <IconButton onClick={handleClose}>
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
                  onChange={setGender}
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
