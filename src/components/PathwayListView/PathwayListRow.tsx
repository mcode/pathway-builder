import React, { FC } from 'react';
import { EvaluatedPathway } from 'pathways-model';
import styles from './PathwayList.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

interface PathwayListRowProps {
  pathway: EvaluatedPathway;
  deleteButton: Function;
  editButton: Function;
}

export const PathwayListRow: FC<PathwayListRowProps> = ({
  pathway,
  editButton,
  deleteButton,
}) => {
  const editText: string = ' EDIT';
  const deleteText: string = ' DELETE';
  return (
    <tr className={styles.tableRow} >
      <td className={styles.nameCell}>{pathway.pathway.name}</td>
      {/* TODO: display the status */}
      <td className={styles.rowCell}>Draft</td>
      {/* TODO: display the last update time */}
      <td className={styles.rowCell}>2 Days ago</td>
      <td className={styles.buttonCell}>
        <button
          className={styles.editButton}
          type="button"
          onClick={() => editButton(pathway.pathway.name)}
        >
          <FontAwesomeIcon icon={faEdit} className={styles.editIcon} />
          {editText}
        </button>
        <button
          className={styles.deleteButton}
          type="button"
          onClick={() => deleteButton(pathway.pathway.name)}
        >
          <FontAwesomeIcon icon={faTrashAlt} className={styles.deleteIcon} />
          {deleteText}
        </button>
      </td>
    </tr>
  );
};
