import React, { FC, memo, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { OutlinedInput, InputAdornment } from '@material-ui/core';

import useStyles from './styles';

interface TextInputProps {
  id: string;
  placeholder?: string;
  icon: IconProp;
  type?: string;
  helperText?: ReactNode;
}

const TextInput: FC<TextInputProps> = ({
  id,
  placeholder = '',
  icon,
  type = 'text',
  helperText = ''
}) => {
  const styles = useStyles();

  return (
    <div className={styles.textInput}>
      <OutlinedInput
        id={id}
        type={type}
        placeholder={placeholder || ''}
        className={styles.input}
        startAdornment={
          <InputAdornment position="start" className={styles.icon}>
            <FontAwesomeIcon icon={icon} />
          </InputAdornment>
        }
      />
      {helperText}
    </div>
  );
};

export default memo(TextInput);
