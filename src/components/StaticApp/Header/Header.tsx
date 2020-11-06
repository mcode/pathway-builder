import React, { FC, memo, useCallback, useState, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { useCurrentCriteriaContext } from 'components/CurrentCriteriaProvider';
import { useThemeToggle } from 'components/ThemeProvider';

import logo from 'assets/camino-logo-dark.png';
import styles from 'components/Header/Header.module.scss';
import useStyles from './styles';
import { useAuthModalContext } from 'components/Auth/AuthModalProvider';

const DemoBanner: FC = () => {
  const styles = useStyles();
  const { openLoginModal, openSignupModal } = useAuthModalContext();

  return (
    <div className={styles.root}>
      <FontAwesomeIcon icon={faExclamationCircle} className={styles.icon} />
      You are currently viewing syntheic demo data. Any changes made will not be saved. To create
      your own pathways,{' '}
      <span className={styles.underline} onClick={openLoginModal}>
        login
      </span>{' '}
      or{' '}
      <span className={styles.underline} onClick={openSignupModal}>
        sign up
      </span>
      .
    </div>
  );
};

const Header: FC = () => {
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
      <header className={styles.header}>
        <Link to="/demo" className={styles.homeLink} onClick={resetCurrentCriteria}>
          <img src={logo} alt="logo" className={styles.logo} />
        </Link>

        <button onClick={openMenu} aria-controls="options-menu" aria-haspopup="true">
          <FontAwesomeIcon icon={faCog} />
        </button>

        <Menu
          id="options-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={closeMenu}
        >
          <MenuItem onClick={handleToggleTheme}>Toggle Theme</MenuItem>
        </Menu>
      </header>
      <DemoBanner />
    </>
  );
};

export default memo(Header);
