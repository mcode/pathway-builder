import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import styles from './Loading.module.scss';

export default function Loading() {
  return (
    <div className={styles.root}>
      <FontAwesomeIcon icon={faSpinner} className={styles.root} size="4x" spin />
    </div>
  );
}
