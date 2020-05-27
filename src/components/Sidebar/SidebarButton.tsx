import React, { FC, memo, ReactNode } from 'react';
import { Button } from '@material-ui/core';

import useStyles from './styles';

interface SidebarButtonProps {
  buttonName: string;
  buttonIcon: ReactNode;
  buttonText: string;
  onClick?: () => void;
}

const SidebarButton: FC<SidebarButtonProps> = ({ buttonName, buttonIcon, buttonText, onClick }) => {
  const styles = useStyles();

  return (
    <div className={styles.sidebarButtonGroup}>
      <Button
        className={styles.sidebarButton}
        variant="contained"
        color="primary"
        startIcon={buttonIcon}
        onClick={onClick}
      >
        {buttonName}
      </Button>

      <div className={styles.sidebarButtonText}>{buttonText}</div>
    </div>
  );
};

export default memo(SidebarButton);
