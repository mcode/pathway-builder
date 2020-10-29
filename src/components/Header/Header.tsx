import React, { FC, memo, useCallback, useState, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { useCurrentCriteriaContext } from 'components/CurrentCriteriaProvider';
import { useThemeToggle } from '../ThemeProvider';

import logo from 'assets/camino-logo-dark.png';
import styles from './Header.module.scss';

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
    <header className={styles.header}>
      <Link to="/" className={styles.homeLink} onClick={(): void => resetCurrentCriteria()}>
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
  );
};

export default memo(Header);
