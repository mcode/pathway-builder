import React, { FC, ChangeEvent } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faEdit } from '@fortawesome/free-solid-svg-icons';
import { usePathwayContext } from 'components/PathwayProvider';
import styles from './Sidebar.module.scss';
import { FormControl, makeStyles, TextField, InputAdornment, Input } from '@material-ui/core';

interface ChoiceNodeProps {
  transition: string;
}

const ChoiceNode: FC<ChoiceNodeProps> = ({ transition }) => {
  const { pathway } = usePathwayContext();

  const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1, 0),
      minWidth: 120,
      display: 'flex',
      flexWrap: 'wrap'
    },
    rename: {
      fontSize: '2rem',
      display: 'flex',
      flexWrap: 'wrap'
    }
  }));

  const classes = useStyles();
  const initial = pathway !== null ? pathway.states[transition].label : 'Choice Node';

  // TODO: in PATHWAYS-256 use the data from the pathway
  const [choice, setChoice] = React.useState('');
  const [label, setLabel] = React.useState<string>(initial);

  const handleChoiceChange = (event: ChangeEvent<{ value: unknown }>): void => {
    // TODO: in PATHWAYS-256 need to update the state of the node
    setChoice(event.target.value as string);
  };

  const handleLabelChange = (event: ChangeEvent<{ value: unknown }>): void => {
    // TODO: in PATHWAYS-256 need to update the transition of the previous node
    // and the state of the choice node
    setLabel(event.target.value as string);
  };

  // TODO: in PATHWAYS-256 the forward button needs to select the newly created choice node
  return (
    <div>
      <div className={styles.choiceNode}>
        <FormControl className={classes.formControl}>
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
      <hr />
    </div>
  );
};

export default ChoiceNode;
