import React, { FC, useState, useEffect, useRef, RefObject } from 'react';

import Button from '@material-ui/core/Button';
import DropDown from 'components/DropDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faPlus,
  faEdit,
  faEllipsisH
} from '@fortawesome/free-solid-svg-icons';
import styles from './Sidebar.module.scss';
import { usePathwayContext } from 'components/PathwayProvider';

interface SidebarProps {
  headerElement: RefObject<HTMLDivElement>;
}

const AddNodes: FC = () => {
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
};

const SidebarHeader: FC = () => {
  const { currentNode } = usePathwayContext();
  return (
    <div className={styles.header}>
      <div className={styles.icon} id={styles.back}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </div>
      <div className={styles.nodeName}>{currentNode.label}</div>
      <div className={styles.icon}>
        <FontAwesomeIcon icon={faEdit} />
      </div>
      <div className={styles.icon} id={styles.nodeSettings}>
        <FontAwesomeIcon icon={faEllipsisH} />
      </div>
    </div>
  );
};

const Sidebar: FC<SidebarProps> = ({ headerElement }) => {
  const sidebarContainerElement = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const expand = (): void => {
    setIsExpanded(!isExpanded);
  };

  // Set the height of the sidebar container
  useEffect(() => {
    if (sidebarContainerElement?.current && headerElement?.current)
      sidebarContainerElement.current.style.height =
        window.innerHeight - headerElement.current.clientHeight + 'px';
  }, [isExpanded, headerElement]);

  if (isExpanded) {
    return (
      <div className={styles.sidebarContainer} ref={sidebarContainerElement}>
        <div className={styles.sidebar}>
          <SidebarHeader />
          <hr />
          <DropDown
            label={'Node Type'}
            id={'Node Type'}
            options={[
              { label: 'Action', value: 'action' },
              { label: 'Branch', value: 'branch' }
            ]}
          />
          <AddNodes />
        </div>

        <div className={styles.sidebarToggle} onClick={expand}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.sidebarContainer}>
        <div className={styles.sidebarToggle} onClick={expand}>
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </div>
    );
  }
};

export default Sidebar;
