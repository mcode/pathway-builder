import React, { FC, memo, useCallback, useState, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { useCurrentCriteriaContext } from 'components/CurrentCriteriaProvider';
import { useThemeToggle } from '../ThemeProvider';

import logo from 'camino-builder-logo-light-bg.png';
import mitre from 'mitre.png';
import mcode from 'mcode.png';
import styles from './AuthFooter.module.scss';

const AuthFooter: FC = () => {
  const { resetCurrentCriteria } = useCurrentCriteriaContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const toggleTheme = useThemeToggle();

  const openMenu = useCallback((event: MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  }, []);

  const closeMenu = useCallback((): void => {
    setAnchorEl(null);
  }, []);

  const handleToggleTheme = useCallback((): void => {
    toggleTheme();
    closeMenu();
  }, [toggleTheme, closeMenu]);

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
