import React, { FC, memo } from 'react';
import { Button, Tooltip } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import useStyles from './styles';

interface SidebarButtonProps {
  buttonName: string;
  buttonIcon: IconDefinition;
  buttonText: string;
  extraMargin?: boolean;
  onClick?: () => void;
  hasTooltip?: boolean;
  tooltipTitle?: string;
  disabled?: boolean;
}

const SidebarButton: FC<SidebarButtonProps> = ({
  buttonName,
  buttonIcon,
  buttonText,
  extraMargin = false,
  onClick,
  hasTooltip = false,
  tooltipTitle = '',
  disabled = false
}) => {
  const styles = useStyles();

  const ConditionalTooltip: FC = ({ children }) =>
    hasTooltip ? (
      <Tooltip title={tooltipTitle} placement="top">
        <span>{children}</span>
      </Tooltip>
    ) : (
      <>{children}</>
    );

  return (
    <div className={extraMargin ? styles.sidebarButtonGroupExtraMargin : styles.sidebarButtonGroup}>
      <ConditionalTooltip>
        <Button
          className={styles.sidebarButton}
          variant="contained"
          color="primary"
          startIcon={<FontAwesomeIcon icon={buttonIcon} />}
          onClick={onClick}
          disabled={disabled}
        >
          {buttonName}
        </Button>
      </ConditionalTooltip>
      <div className={styles.sidebarButtonText}>{buttonText}</div>
    </div>
  );
};

export default memo(SidebarButton);
