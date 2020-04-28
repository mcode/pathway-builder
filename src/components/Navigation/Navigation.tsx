import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import styles from './Navigation.module.scss';

const useStyles = makeStyles(
  theme => ({
    navigation: {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary
    }
  }),
  { name: 'Navigation' }
);

interface Props {
  name?: string;
  onBack?: () => void;
}

const Navigation: FC<Props> = ({ name = '', onBack }) => {
  const classes = useStyles();

  return (
    <nav className={clsx(styles.navigation, classes.navigation)}>
      <div className={styles.navigation__leftPanel}>
        {onBack && (
          <FontAwesomeIcon
            icon={faChevronLeft}
            className={styles.navigation__back}
            onClick={onBack}
          />
        )}
        <p>{name}</p>
      </div>
    </nav>
  );
};

export default Navigation;
