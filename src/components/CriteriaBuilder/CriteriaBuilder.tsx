import React, { FC, memo, useCallback, useState, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import DropDown from 'components/elements/DropDown';
import useStyles from './styles';

const CriteriaBuilder: FC = () => {
  const styles = useStyles();
  const [selectedElement, setSelectedElement] = useState<string>('');
  const [selectedDemoElement, setSelectedDemoElement] = useState<string>('');
  const elementOptions = [{ value: 'demographics', label: 'Demographics' }];
  const demoElementOptions = [
    { value: 'age range', label: 'Age Range' },
    { value: 'gender', label: 'Gender' }
  ];

  const onElementSelected = useCallback((event: ChangeEvent<{ value: string }>): void => {
    setSelectedElement(event?.target.value || '');
  }, []);

  const onDemoElementSelected = useCallback((event: ChangeEvent<{ value: string }>): void => {
    setSelectedDemoElement(event?.target.value || '');
  }, []);

  return (
    <>
      <div>
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
          {selectedDemoElement === 'gender' && <div>gender</div>}
          {selectedDemoElement === 'age range' && <div>age range</div>}
          </>
        )}
      </div>
    </>
  );
};

export default memo(CriteriaBuilder);
