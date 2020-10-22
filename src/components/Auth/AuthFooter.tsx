import React, { FC, memo } from 'react';
import { Link } from 'react-router-dom';

import { useCurrentCriteriaContext } from 'components/CurrentCriteriaProvider';
import mitre from 'mitre.png';
import mcode from 'mcode.png';
import styles from './Auth.module.scss';

const AuthFooter: FC = () => {
  const { resetCurrentCriteria } = useCurrentCriteriaContext();

  return (
    <footer className={styles.footer}>
      <Link to="/" className={styles.mitreButton} onClick={(): void => resetCurrentCriteria()}>
        <img src={mitre} alt="logo"></img>
      </Link>
      <Link to="/" className={styles.mcodeButton} onClick={(): void => resetCurrentCriteria()}>
        <img src={mcode} alt="logo"></img>
      </Link>
    </footer>
  );
};

export default memo(AuthFooter);
