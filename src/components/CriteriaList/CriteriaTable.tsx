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

import useStyles from './styles';
import { useCriteriaContext } from 'components/CriteriaProvider';

const CriteriaTable: FC = () => {
  const styles = useStyles();
  const { criteria } = useCriteriaContext();

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
          {criteria.map(c => (
            <TableRow key={c.label}>
              <TableCell component="th" scope="row">
                {c.label}
              </TableCell>
              <TableCell>{c.version}</TableCell>
              <TableCell>2 days ago</TableCell>

              <TableCell align="right">
                <Button
                  className={styles.editButton}
                  color="primary"
                  size="small"
                  startIcon={<FontAwesomeIcon icon={faEdit} />}
                >
                  Edit
                </Button>

                <Button
                  color="secondary"
                  size="small"
                  startIcon={<FontAwesomeIcon icon={faTrashAlt} />}
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
