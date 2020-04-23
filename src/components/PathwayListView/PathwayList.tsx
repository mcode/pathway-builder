import React, { FC } from 'react';

import { PathwayListRow } from './PathwayListRow';
import { Pathway, EvaluatedPathway } from 'pathways-model';
import styles from './PathwayList.module.scss';
import { Service } from 'pathways-objects';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface PathwayListProps {
  pathways: EvaluatedPathway[];
  deleteButton: Function;
  editButton: Function;
}

const PathwayList: FC<PathwayListProps> = ({
  pathways,
  deleteButton,
  editButton,
}) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.headerRow}>
          <th className={styles.nameHeader}>Pathway Name</th>
          <th className={styles.headerCell}>Status</th>
          <th className={styles.headerCell}>Last Updated</th>
          <th className={styles.buttonHeader}></th>
        </tr>
      </thead>
      <tbody>
        {pathways.map((pathway) => (
          <PathwayListRow
            key={pathway.pathway.name}
            pathway={pathway}
            editButton={editButton}
            deleteButton={deleteButton}
          />
        ))}
      </tbody>
    </table>
  );
};

interface PathwaysListProps {
  evaluatedPathways: EvaluatedPathway[];
  callback: Function;
  service: Service<Array<Pathway>>;
}

const PathwaysList: FC<PathwaysListProps> = ({
  evaluatedPathways,
  callback,
  service,
}) => {
  const createPathwayText: string = ' Create Pathway';
  return (
    <div className={styles.pathways_list}>
      {service.status === 'loading' ? (
        <div>Loading...</div>
      ) : service.status === 'loaded' ? (
        <div>
          <br />
          <button
            className={styles.createButton}
            onClick={(): void => callback()}
          >
            <FontAwesomeIcon icon={faPlus} className={styles.createIcon} />
            {createPathwayText}
          </button>
          <br />
          <PathwayList
            pathways={evaluatedPathways}
            deleteButton={(): void => callback()}
            editButton={(): void => callback()}
          />
        </div>
      ) : (
        <div>ERROR</div>
      )}
    </div>
  );
};

export default PathwaysList;
