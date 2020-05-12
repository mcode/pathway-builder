import React, { FC } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faEdit } from '@fortawesome/free-solid-svg-icons';
import styles from './Sidebar.module.scss';
import { FormControl, makeStyles, TextField, InputAdornment, Input } from '@material-ui/core';

interface ChoiceNodeProps {
  transition: string;
}

const ChoiceNode: FC<ChoiceNodeProps> = ({ transition }) => {
  const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1, 0),
      minWidth: 120,
      display: 'flex',
      flexWrap: 'wrap'
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    },
    rename: {
      fontSize: '2rem',
      display: 'flex',
      flexWrap: 'wrap'
    }
  }));

  const classes = useStyles();

  const [choice, setChoice] = React.useState('');
  const [label, setLabel] = React.useState<string>(transition);

  const handleChoiceChange = (event: any) => {
    // TODO: in PATHWAYS-256 need to update the state of the node
    setChoice(event.target.value);
  };

  const handleLabelChange = (event: any) => {
    // TODO: in PATHWAYS-256 need to update the transition of the previous node and the state of the choice node
    setLabel(event.target.value);
  };

  // TODO: in PATHWAYS-256 the forward button needs to select the newly created choice node
  return (
    <div>
      <div className={styles.choiceNode}>
        <FormControl className={styles.nodeName}>
          <Input
            classes={{ input: classes.rename }}
            value={label}
            type="text"
            onChange={handleLabelChange}
            endAdornment={
              <InputAdornment position="end">
                <FontAwesomeIcon icon={faEdit} className={styles.icon} />
              </InputAdornment>
            }
          />
        </FormControl>
        <div className={styles.icon} id={styles.forward}>
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </div>
      <FormControl variant="outlined" className={classes.formControl} fullWidth>
        <TextField
          label="Choice Node Value"
          value={choice}
          variant="outlined"
          onChange={handleChoiceChange}
          error={choice === ''}
        />
      </FormControl>
    </div>
  );
};

export default ChoiceNode;
