import React, { FC, memo } from 'react';

import { useCurrentCriteriaContext } from 'components/CurrentCriteriaProvider';
import mitre from 'assets/mitre.png';
import mcode from 'assets/mcode.png';
import useStyles from './styles';

const LandingFooter: FC = () => {
  const styles = useStyles();
  const { resetCurrentCriteria } = useCurrentCriteriaContext();

  return (
    <footer className={styles.footer}>
      <a
        href="https://mitre.org/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.footerLogo}
        onClick={(): void => resetCurrentCriteria()}
      >
        <img src={mitre} alt="mitre logo" className={styles.mitreLogo} />
      </a>

      <a
        href="https://mcodeinitiative.org/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.footerLogo}
        onClick={(): void => resetCurrentCriteria()}
      >
        <img src={mcode} alt="mcode logo" />
      </a>
    </footer>
  );
};

export default memo(LandingFooter);
