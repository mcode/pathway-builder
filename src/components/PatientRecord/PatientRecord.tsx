import React, { FC, useState, useEffect, useRef, RefObject } from 'react';

import { DomainResource } from 'fhir-objects';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNotesMedical,
  faChevronLeft
} from '@fortawesome/free-solid-svg-icons';
import styles from './PatientRecord.module.scss';

interface PatientRecordProps {
  headerElement: RefObject<HTMLDivElement>;
}

interface PatientRecordElementProps {
  resourceType: string;
  resources: ReadonlyArray<DomainResource>;
}

interface VisualizerProps {
  resourceType: string;
  resourcesByType: ReadonlyArray<DomainResource>;
}

const PatientRecord: FC<PatientRecordProps> = ({ headerElement }) => {
  const recordContainerElement = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const expand = (): void => {
    setIsExpanded(!isExpanded);
  };

  // Set the height of the patient record container
  useEffect(() => {
    if (recordContainerElement?.current && headerElement?.current)
      recordContainerElement.current.style.height =
        window.innerHeight - headerElement.current.clientHeight + 'px';
  }, [isExpanded, headerElement]);

  if (isExpanded) {
    return (
      <div className={styles.record} ref={recordContainerElement}>
        <div className={styles.sidebar}>
          TODO: PUT A SIDEBAR HERE
        </div>

        <div className={styles.recordToggle} onClick={expand}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.record}>
        <div className={styles.recordToggle} onClick={expand}>
          <FontAwesomeIcon icon={faNotesMedical} />
        </div>
      </div>
    );
  }
};


export default PatientRecord;
