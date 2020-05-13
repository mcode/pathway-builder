import React, { FC, memo, useCallback, useState, useEffect, useRef, RefObject } from 'react';
import Button from '@material-ui/core/Button';
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

interface SidebarProps {
  headerElement: RefObject<HTMLDivElement>;
  currentNode: State;
}

interface SidebarHeaderProps {
  currentNodeLabel: string;
}

const nodeTypeOptions = [
  { label: 'Action', value: 'action' },
  { label: 'Branch', value: 'branch' }
];

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
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const theme = useTheme('dark');
  const sidebarContainerElement = useRef<HTMLDivElement>(null);

  const toggleSidebar = useCallback((): void => {
    setIsExpanded(expanded => !expanded);
  }, []);

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
            <DropDown label="Node Type" id="Node Type" options={nodeTypeOptions} />
            <AddNodes />
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
