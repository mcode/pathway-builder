import React, { FC } from 'react';
import { Pathway, EvaluatedPathway } from 'pathways-model';
import { Service } from 'pathways-objects';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';

import Loading from 'components/elements/Loading/Loading';

import styles from './PathwaysList.module.scss';

interface PathwaysTableProps {
  pathways: EvaluatedPathway[];
  deleteButton: (pathway: object) => void;
  editButton: (pathway: object) => void;
}

const PathwaysTable: FC<PathwaysTableProps> = ({ pathways, deleteButton, editButton }) => {
  return (
    <TableContainer className={styles.pathwayList}>
      <Table aria-label="pathway list">
        <TableHead>
          <TableRow>
            <TableCell>Pathway Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Last Updated</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {pathways.map(pathway => (
            <TableRow key={pathway.pathway.name}>
              <TableCell component="th" scope="row">
                {pathway.pathway.name}
              </TableCell>
              <TableCell>draft</TableCell>
              <TableCell>2 days ago</TableCell>
              <TableCell align="right">
                <Button
                  className={styles.editButton}
                  color="primary"
                  size="small"
                  startIcon={<FontAwesomeIcon icon={faEdit} />}
                  onClick={(): void => editButton(pathway)}
                >
                  Edit
                </Button>

                <Button
                  color="secondary"
                  size="small"
                  startIcon={<FontAwesomeIcon icon={faTrashAlt} />}
                  onClick={(): void => deleteButton(pathway)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

interface PathwaysListProps {
  evaluatedPathways: EvaluatedPathway[];
  callback: Function;
  service: Service<Array<Pathway>>;
}

const PathwaysList: FC<PathwaysListProps> = ({ evaluatedPathways, callback, service }) => {
  if (service.status === 'loading') return <Loading />;

  return (
    <div className={styles.root}>
      <Button
        className={styles.createPathwayButton}
        variant="contained"
        color="primary"
        startIcon={<FontAwesomeIcon icon={faPlus} />}
        onClick={(): void => callback()}
      >
        Create Pathway
      </Button>

      <PathwaysTable
        pathways={evaluatedPathways}
        deleteButton={(): void => callback()}
        editButton={(): void => callback()}
      />
    </div>
  );
};

export default PathwaysList;
