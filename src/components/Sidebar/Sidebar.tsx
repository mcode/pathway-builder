import React, { FC, memo, useCallback, useState, useEffect, useRef, RefObject } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faPlus,
  faEdit,
  faEllipsisH
} from '@fortawesome/free-solid-svg-icons';

import DropDown from 'components/DropDown';
import { useTheme } from 'components/ThemeProvider';
import { State } from 'pathways-model';
import styles from './Sidebar.module.scss';
import {
  Select,
  MenuItem,
  FormControl,
  makeStyles,
  InputLabel,
  Button,
  TextField,
  InputAdornment,
  Input
} from '@material-ui/core';

interface SidebarProps {
  headerElement: RefObject<HTMLDivElement>;
  currentNode: State;
}

interface AddNodeProps {
  addBranchNode: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface CriteraProps {
  critera: string;
  handleCriteraChange: (
    event: ChangeEvent<{ name?: string | undefined; value: unknown }>,
    child: ReactNode
  ) => void;
  classes: any;
}

interface BranchNodeProps {
  currentNode: State;
  addChoiceNode: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface SidebarHeaderProps {
  currentNodeLabel: string;
  }
  
interface ChoiceNodeProps {
  transition: string;
}

const nodeTypeOptions = [
  { label: 'Action', value: 'action' },
  { label: 'Branch', value: 'branch' }
];

interface AddChoiceButtonProps {
  addChoiceNode: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const AddNodes: FC<AddNodeProps> = ({ addBranchNode }) => {
const AddNodes: FC = memo(() => {

  return (
    <div className={styles.addNodesContainer}>
      <table>
        <tbody>
          <tr>
            <td className={styles.button}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<FontAwesomeIcon icon={faPlus} />}
              >
                Add Action Node
              </Button>
            </td>
            <td className={styles.description}>
              Any clinical or worfklow step which is not a decision.
            </td>
          </tr>
          <tr>
            <td className={styles.button}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<FontAwesomeIcon icon={faPlus} />}
                onClick={addBranchNode}
              >
                Add Branch Node
              </Button>
            </td>
            <td className={styles.description}>
              A logical branching point based on clinical or workflow criteria.
            </td>
          </tr>
          <tr>
            <td className={styles.button}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<FontAwesomeIcon icon={faPlus} />}
              >
                Add Reusable Node
              </Button>
            </td>
            <td className={styles.description}>
              A previously built node or group of nodes defining a set of criteria.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

const AddBranchNode: FC<BranchNodeProps> = ({ currentNode, addChoiceNode }) => {
  // TODO: in PATHWAYS-256 use the properties in the pathway instead?
  const [source, setSource] = React.useState('');
  const [critera, setCritera] = React.useState('');

  const handleSourceChange = (event: any) => {
    // TODO: in PATHWAYS-256 set the source
    setSource(event.target.value);
    setCritera('');
  };

  const handleCriteraChange = (event: any) => {
    // TODO: in PATHWAYS-256 set the criteria
    setCritera(event.target.value);
  };

  const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1, 0),
      minWidth: 120
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    }
  }));

  const classes = useStyles();

  let displayCritera = null;
  if (source === 'mCode') {
    displayCritera = (
      <McodeOptions critera={critera} handleCriteraChange={handleCriteraChange} classes={classes} />
    );
  } else if (source === 'other') {
    displayCritera = (
      <OtherOptions critera={critera} handleCriteraChange={handleCriteraChange} classes={classes} />
    );
  } else {
    displayCritera = null;
  }

  return (
    <div className={styles.addNodesContainer}>
      <FormControl variant="outlined" className={classes.formControl} fullWidth>
        <InputLabel>Criteria Source</InputLabel>
        <Select
          value={source}
          onChange={handleSourceChange}
          displayEmpty
          label="Criteria Source"
          error={source === ''}
        >
          <MenuItem value={'mCode'}>mCODE</MenuItem>
          <MenuItem value={'other'}>Other Library</MenuItem>
        </Select>
      </FormControl>
      {displayCritera}
      <hr />
      {currentNode.transitions.map((transition, index) => (
        <ChoiceNode key={index} transition={transition.transition} />
      ))}
      {critera !== '' ? <AddChoiceButton addChoiceNode={addChoiceNode} /> : null}
    </div>
  );
};

const McodeOptions: FC<CriteraProps> = ({ critera, handleCriteraChange, classes }) => {
  return (
    <FormControl variant="outlined" className={classes.formControl} fullWidth>
      <InputLabel>Criteria</InputLabel>
      <Select
        value={critera}
        onChange={handleCriteraChange}
        displayEmpty
        label="Criteria"
        error={critera === ''}
      >
        <MenuItem value={'tumor'}>Tumor Category</MenuItem>
        <MenuItem value={'node'}>Node Category</MenuItem>
        <MenuItem value={'metastatis'}>Metastatis Category</MenuItem>
      </Select>
    </FormControl>
  );
};

const OtherOptions: FC<CriteraProps> = ({ critera, handleCriteraChange, classes }) => {
  return (
    <FormControl variant="outlined" className={classes.formControl} fullWidth>
      <InputLabel>Criteria</InputLabel>
      <Select
        value={critera}
        onChange={handleCriteraChange}
        displayEmpty
        label="Criteria"
        error={critera === ''}
      >
        <MenuItem value={'other'}>Other Library</MenuItem>
      </Select>
    </FormControl>
  );
};

// TODO: in PATHWAYS-256 Add choice needs to update the pathway with the new transition and new state
const AddChoiceButton: FC<AddChoiceButtonProps> = ({ addChoiceNode }) => {
  return (
    <table>
      <tbody>
        <tr>
          <td className={styles.button}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FontAwesomeIcon icon={faPlus} />}
              onClick={addChoiceNode}
            >
              Add Choice Node
            </Button>
          </td>
          <td className={styles.description}>
            A logical choice for a clinical decision within a workflow.
          </td>
        </tr>
      </tbody>
    </table>
  );
};

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

const SidebarHeader: FC<SidebarHeaderProps> = memo(({ currentNodeLabel }) => {

  return (
    <div className={styles.header}>
      <div className={styles.icon} id={styles.back}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </div>

      <div className={styles.nodeName}>{currentNodeLabel}</div>

      <div className={styles.icon}>
        <FontAwesomeIcon icon={faEdit} />
      </div>

      <div className={styles.icon} id={styles.nodeSettings}>
        <FontAwesomeIcon icon={faEllipsisH} />
      </div>
    </div>
  );
});

const Sidebar: FC<SidebarProps> = ({ headerElement, currentNode }) => {
  const { currentNode, pathway } = usePathwayContext();

  // TODO: in PATHWAYS-256 get type based on state
  if (currentNode.nodeType === undefined) {
    currentNode.nodeType = 'action';
  }

  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const theme = useTheme('dark');
  const sidebarContainerElement = useRef<HTMLDivElement>(null);
  const [type, setType] = useState<string>(currentNode.nodeType);

  // TODO: in PATHWAYS-256 get/use type based on state
  if (type !== currentNode.nodeType) {
    setType(currentNode.nodeType);
  }

  const toggleSidebar = useCallback((): void => {
    setIsExpanded(expanded => !expanded);
  }, []);

  const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1, 0),
      minWidth: 120
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    }
  }));

  const classes = useStyles();

  const addBranchNode = (): void => {
    // TODO: in PATHWAYS-256 this needs to do the following
    // Add a new state with nodeType = 'branch'
    // select the new state
    // remove the modification of the currentNode
    if (pathway !== null && currentNode.label !== undefined) {
      const label = currentNode.label.replace(/\s/g, '');
      pathway.states[label].nodeType = 'branch';
    }
    setType('branch');
  };

  const handleTypeChange = (event: any) => {
    // TODO: in PATHWAYS-256 switch the node to the appropriate type and remove thise
    if (pathway !== null) {
      const label = currentNode.label.replace(/\s/g, '');
      pathway.states[label].nodeType = event.target.value;
    }
    currentNode.nodeType = event.target.value;
    setType(event.target.value);
  };

  const addChoiceNoide = () => {
    // TODO: in PATHWAYS-256 adding a choice node needs to modify the pathway
    console.log('Add Choice Node Clicked');

    // TODO: in PATHWASYS-256 remove this
    const newTransition = {
      transition: 'Choice Node',
      condition: {
        description: 'new description',
        cql: 'new cql'
      }
    };
    currentNode.transitions.push(newTransition);
  };

  // Set the height of the sidebar container
  useEffect(() => {
    if (sidebarContainerElement?.current && headerElement?.current)
      sidebarContainerElement.current.style.height =
        window.innerHeight - headerElement.current.clientHeight + 'px';
  }, [isExpanded, headerElement]);

  return (
    <MuiThemeProvider theme={theme}>
      <div className={styles.sidebarContainer} ref={sidebarContainerElement}>
        {isExpanded && (
          <div className={styles.sidebar}>
            <SidebarHeader currentNodeLabel={currentNode?.label || ''} />
            <hr />
            <AddNodes />
          <FormControl variant="outlined" className={classes.formControl} fullWidth>
            <InputLabel>Node Type</InputLabel>
            <Select
              value={currentNode.nodeType}
              onChange={handleTypeChange}
              label="Node Type"
              error={currentNode.nodeType === null}
            >
              <MenuItem value={'action'}>Action</MenuItem>
              <MenuItem value={'branch'}>Branch</MenuItem>
            </Select>
          </FormControl>
          {currentNode.nodeType === 'branch' ? (
            <AddBranchNode currentNode={currentNode} addChoiceNode={addChoiceNoide} />
          ) : (
            <AddNodes addBranchNode={addBranchNode} />
          )}
          </div>
        )}

        <div className={styles.sidebarToggle} onClick={toggleSidebar}>
          <FontAwesomeIcon icon={isExpanded ? faChevronLeft : faChevronRight} />
        </div>
      </div>
    </MuiThemeProvider>
  );
};

export default memo(Sidebar);
