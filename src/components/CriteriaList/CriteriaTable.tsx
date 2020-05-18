import React, { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';

import { usePathwayContext } from 'components/PathwayProvider';

import useStyles from './styles';

const CriteriaTable: FC = () => {
  const styles = useStyles();
  const { pathways, deletePathway } = usePathwayContext();

  return (
    <TableContainer className={styles.criteriaList}>
      <Table aria-label="criteria list">
        <TableHead>
          <TableRow>
            <TableCell>Criteria Name</TableCell>
            <TableCell>Version</TableCell>
            <TableCell>Added</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {pathways.map(pathway => (
            <TableRow key={pathway.id}>
              <TableCell component="th" scope="row">
                {pathway.name}
              </TableCell>

              <TableCell>1.0.0</TableCell>
              <TableCell>2 days ago</TableCell>

              <TableCell align="right">
                <Button
                  className={styles.editButton}
                  color="primary"
                  size="small"
                  startIcon={<FontAwesomeIcon icon={faEdit} />}
                  component={Link}
                  to={`/builder/${encodeURIComponent(pathway.id)}`}
                >
                  Edit
                </Button>

                <Button
                  color="secondary"
                  size="small"
                  startIcon={<FontAwesomeIcon icon={faTrashAlt} />}
                  onClick={(): void => deletePathway(pathway)}
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

export default memo(CriteriaTable);
