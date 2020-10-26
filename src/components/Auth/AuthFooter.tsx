import React, { FC, memo } from 'react';
import { Link } from 'react-router-dom';

import { useCurrentCriteriaContext } from 'components/CurrentCriteriaProvider';
import mitre from 'mitre.png';
import mcode from 'mcode.png';
import useStyles from './styles';

const AuthFooter: FC = () => {
  const styles = useStyles();
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
