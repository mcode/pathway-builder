import React, { FC, memo } from 'react';
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
import moment from 'moment';

import useStyles from './styles';
import { useCriteriaContext } from 'components/CriteriaProvider';

const CriteriaTable: FC = () => {
  const styles = useStyles();
  const { criteria, deleteCriteria } = useCriteriaContext();

  const renderDate = (datetime: number): string => {
    return moment(datetime).fromNow();
  };

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
            <TableRow key={c.id}>
              <TableCell component="th" scope="row">
                {c.label}
              </TableCell>
              <TableCell>{c.version}</TableCell>
              <TableCell>{renderDate(c.modified)}</TableCell>

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
                  onClick={(): void => deleteCriteria(c.id)}
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
