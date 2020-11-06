import React, { FC, memo } from 'react';

import mitre from 'assets/mitre.png';
import mcode from 'assets/mcode.png';
import useStyles from './styles';

const LandingFooter: FC = () => {
  const styles = useStyles();

  return (
    <footer className={styles.footer}>
      <a
        href="https://www.mitre.org/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.footerLogo}
      >
        <img src={mitre} alt="mitre logo" className={styles.mitreLogo} />
      </a>

      <a
        href="https://mcodeinitiative.org/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.footerLogo}
      >
        <img src={mcode} alt="mcode logo" className={styles.mcodeLogo} />
      </a>
    </footer>
  );
};

export default memo(LandingFooter);
