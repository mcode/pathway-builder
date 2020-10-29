import React, { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import clsx from 'clsx';

import { useCurrentCriteriaContext } from 'components/CurrentCriteriaProvider';

import logo from 'assets/camino-builder-logo-light-bg.png';
import useStyles from './styles';

interface LandingHeaderProps {
  openLogin: () => void;
  openSignup: () => void;
}

const LandingHeader: FC<LandingHeaderProps> = ({ openLogin, openSignup }) => {
  const styles = useStyles();
  const { resetCurrentCriteria } = useCurrentCriteriaContext();

  return (
    <header className={styles.header}>
      <Link to="/demo" onClick={resetCurrentCriteria} className={styles.logoLink}>
        <img src={logo} alt="logo" className={styles.logo} />
      </Link>

      <>
        <Button className={clsx(styles.authButton, styles.signupButton)} onClick={openSignup}>
          SIGN UP
        </Button>

        <Button className={clsx(styles.authButton, styles.loginButton)} onClick={openLogin}>
          LOGIN
        </Button>
      </>
    </header>
  );
};

export default memo(LandingHeader);
