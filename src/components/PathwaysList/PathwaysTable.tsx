import React, { FC, memo, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faFileDownload, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link
} from '@material-ui/core';

import { usePathwaysContext } from 'components/PathwaysProvider';
import { downloadPathway } from 'utils/builder';
import PathwayModal from './PathwayModal';

import useStyles from './styles';
import { Pathway } from 'pathways-model';
import { Link as RouterLink } from 'react-router-dom';

const PathwaysTable: FC = () => {
  const styles = useStyles();
  const { pathways, deletePathway } = usePathwaysContext();
  const [open, setOpen] = useState(false);
  const [editablePathway, setEditablePathway] = useState<Pathway>();

  const openEditPathwayModal = useCallback((pathway: Pathway): void => {
    setOpen(true);
    setEditablePathway(pathway);
  }, []);

  const closeEditPathwayModal = useCallback((): void => {
    setOpen(false);
  }, []);

  return (
    <div>
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
              <TableRow key={pathway.id}>
                <TableCell component="th" scope="row">
                  <Link
                    component={RouterLink}
                    to={`/builder/${encodeURIComponent(pathway.id)}`}
                    color="primary"
                    underline="none"
                  >
                    {pathway.name}
                  </Link>
                </TableCell>

                <TableCell>draft</TableCell>
                <TableCell>2 days ago</TableCell>

                <TableCell align="right">
                  <Button
                    className={styles.pathwaysListButton}
                    color="primary"
                    size="small"
                    startIcon={<FontAwesomeIcon icon={faEdit} />}
                    onClick={(): void => openEditPathwayModal(pathway)}
                  >
                    Edit Info
                  </Button>
                  <Button
                    className={styles.pathwaysListButton}
                    color="primary"
                    size="small"
                    startIcon={<FontAwesomeIcon icon={faFileDownload} />}
                    onClick={(): void => downloadPathway(pathway)}
                  >
                    Export
                  </Button>
                  <Button
                    color="secondary"
                    size="small"
                    startIcon={<FontAwesomeIcon icon={faTrashAlt} />}
                    onClick={(): void => deletePathway(pathway.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PathwayModal open={open} onClose={closeEditPathwayModal} editPathway={editablePathway} />
    </div>
  );
};

export default memo(PathwaysTable);
