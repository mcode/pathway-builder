import React, { FC } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import indexStyles from 'styles/index.module.scss';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface ButtonProps {
  text: string;
  icon?: IconProp;
  onClick?: () => void;
}

const Button: FC<ButtonProps> = ({ text, icon, onClick = () => {} }) => {
  return (
    <button className={indexStyles.button} onClick={onClick}>
      {icon && <FontAwesomeIcon icon={icon} />}
      {text}
    </button>
  );
};

export default Button;
