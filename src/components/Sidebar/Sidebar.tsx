import React, { FC, memo, useCallback, useState, useEffect, useRef, RefObject } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AddBranchNode from './AddBranchNode';
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
import { Select, MenuItem, FormControl, makeStyles, InputLabel, Button } from '@material-ui/core';

interface SidebarProps {
  headerElement: RefObject<HTMLDivElement>;
  currentNode: State;
}

interface AddNodeProps {
  addBranchNode: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface SidebarHeaderProps {
  currentNodeLabel: string;
  }
  
const nodeTypeOptions = [
  { label: 'Action', value: 'action' },
  { label: 'Branch', value: 'branch' }
];

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

  const handleTypeChange = (event: ChangeEvent<{ value: unknown }>): void => {
    // TODO: in PATHWAYS-256 switch the node to the appropriate type and remove this
    if (pathway !== null) {
      const label = currentNode.label.replace(/\s/g, '');
      pathway.states[label].nodeType = event.target.value;
    }
    currentNode.nodeType = event.target.value as string;
    setType(event.target.value as string);
  };

  const addChoiceNoide = (): void => {
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
