import React, { ChangeEvent, FC, memo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import moment from 'moment';

import useStyles from 'components/CriteriaList/styles';
import { useCriteriaContext } from 'components/StaticApp/CriteriaProvider';
import ConfirmedDeletionButton from 'components/ConfirmedDeletionButton';

interface CriteriaTableProps {
  itemSelected: (item: string) => boolean;
  handleSelectClick: (item: string) => (event: ChangeEvent<HTMLInputElement>) => void;
}

const CriteriaTable: FC<CriteriaTableProps> = ({ itemSelected, handleSelectClick }) => {
  const styles = useStyles();
  const { criteria, deleteCriteria } = useCriteriaContext();

  const renderDate = (datetime: number): string => {
    return moment(datetime).fromNow();
  };

  const deletion = useCallback(
    (id: string): void => {
      deleteCriteria(id);
    },
    [deleteCriteria]
  );

  return (
    <TableContainer className={styles.criteriaList}>
      <Table aria-label="criteria list">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox"></TableCell>
            <TableCell>Criteria Name</TableCell>
            <TableCell>Version</TableCell>
            <TableCell>Added</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {criteria.map(c => (
            <TableRow key={c.id}>
              <TableCell padding="checkbox">
                <Checkbox checked={itemSelected(c.id)} onChange={handleSelectClick(c.id)} />
              </TableCell>
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
                <ConfirmedDeletionButton
                  deleteType="criterion"
                  deleteName={c.label}
                  deleteId={c.id}
                  deleteMethod={deletion}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default memo(CriteriaTable);
