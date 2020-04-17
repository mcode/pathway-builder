import React, { FC, useState, useEffect, useRef, RefObject } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import styles from './Sidebar.module.scss';

interface SidebarProps {
  headerElement: RefObject<HTMLDivElement>;
}

const Sidebar: FC<SidebarProps> = ({ headerElement }) => {
  const recordContainerElement = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

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
        <div className={styles.sidebar}>TODO: PUT A SIDEBAR HERE</div>

        <div className={styles.recordToggle} onClick={expand}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.record}>
        <div className={styles.recordToggle} onClick={expand}>
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </div>
    );
  }
};

export default Sidebar;
