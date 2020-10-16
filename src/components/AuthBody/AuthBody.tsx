import React, { FC, memo, useCallback, useState, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { useCurrentCriteriaContext } from 'components/CurrentCriteriaProvider';
import { useThemeToggle } from '../ThemeProvider';

import logo from 'camino-builder-logo-light-bg.png';
import styles from './AuthBody.module.scss';

import example from 'example-pathway.png';
import github from 'github.png';
import email from 'email.png';
const AuthBody: FC = () => {
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
    <>
      <img src={example} alt="pathway" className={styles.example} />
      <label className={styles.mainText}>A simple app to build</label>
      <label className={styles.mainText}> customized clinical pathways</label>
      <label className={styles.subText}>using mCODE. a standardized data </label>
      <label className={styles.subText}> model around cancer</label>
      <button className={styles.tryIt}>Try it</button>
      <span>
        <img className={styles.images} src={github} />
        <img className={styles.images} src={email} />
      </span>
    </>
  );
};

export default memo(AuthBody);
