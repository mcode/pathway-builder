import React, { FC, memo } from 'react';
import { Button } from '@material-ui/core';

import useStyles from './styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface SidebarButtonProps {
  buttonName: string;
  buttonIcon: IconDefinition;
  buttonText: string;
  extraMargin?: boolean;
  onClick?: () => void;
}

const SidebarButton: FC<SidebarButtonProps> = ({
  buttonName,
  buttonIcon,
  buttonText,
  extraMargin = false,
  onClick
}) => {
  const styles = useStyles();

  return (
    <div className={extraMargin ? styles.sidebarButtonGroupExtraMargin : styles.sidebarButtonGroup}>
      <Button
        className={styles.sidebarButton}
        variant="contained"
        color="primary"
        startIcon={<FontAwesomeIcon icon={buttonIcon} />}
        onClick={onClick}
      >
        {buttonName}
      </Button>

      <div className={styles.sidebarButtonText}>{buttonText}</div>
    </div>
  );
};

export default memo(SidebarButton);
