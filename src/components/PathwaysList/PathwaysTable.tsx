import React, { FC, memo, useState, useCallback, MouseEvent, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faFileDownload } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link
} from '@material-ui/core';
import { useQueryCache, useMutation } from 'react-query';

import PathwayModal from './PathwayModal';

import useStyles from './styles';
import { Pathway } from 'pathways-model';
import { Link as RouterLink } from 'react-router-dom';
import ConfirmedDeletionButton from 'components/ConfirmedDeletionButton';
import { ContextualExportMenu } from 'components/elements/ExportMenu';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';
import { deletePathway } from 'utils/backend';

interface PathwaysTableProps {
  pathways: Pathway[];
  itemSelected: (item: string) => boolean;
  handleSelectClick: (item: string) => (event: ChangeEvent<HTMLInputElement>) => void;
}

const PathwaysTable: FC<PathwaysTableProps> = ({ pathways, itemSelected, handleSelectClick }) => {
  const styles = useStyles();
  const cache = useQueryCache();
  const { setCurrentPathway } = useCurrentPathwayContext();
  const [open, setOpen] = useState(false);
  const [editablePathway, setEditablePathway] = useState<Pathway>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const openEditPathwayModal = useCallback((pathway: Pathway): void => {
    setOpen(true);
    setEditablePathway(pathway);
  }, []);

  const closeEditPathwayModal = useCallback((): void => {
    setOpen(false);
  }, []);

  const openMenu = useCallback(
    (event: MouseEvent<HTMLButtonElement>): void => {
      setAnchorEl(event.currentTarget);
      const pathway = pathways.filter(pathway => pathway.id === event.currentTarget.id);
      if (pathway.length) setCurrentPathway(pathway[0]);
    },
    [pathways, setCurrentPathway]
  );

  const closeMenu = useCallback((): void => {
    setAnchorEl(null);
  }, []);

  const [mutateDelete] = useMutation(deletePathway, {
    onSettled: () => {
      cache.invalidateQueries('pathways');
      cache.invalidateQueries('pathway'); // TODO: only invalidate the deleted one
    }
  });

  const deletion = useCallback(
    (id: string): void => {
      mutateDelete(id);
    },
    [mutateDelete]
  );

  return (
    <div>
      <TableContainer className={styles.pathwayList}>
        <Table aria-label="pathway list">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>Pathway Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {pathways.map(pathway => (
              <TableRow key={pathway.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={itemSelected(pathway.id)}
                    onChange={handleSelectClick(pathway.id)}
                  />
                </TableCell>
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
                    id={pathway.id}
                    className={styles.pathwaysListButton}
                    color="primary"
                    size="small"
                    startIcon={<FontAwesomeIcon icon={faFileDownload} />}
                    onClick={openMenu}
                  >
                    Export
                  </Button>
                  <ConfirmedDeletionButton
                    deleteType="pathway"
                    deleteName={pathway.name}
                    deleteId={pathway.id}
                    deleteMethod={deletion}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ContextualExportMenu anchorEl={anchorEl} closeMenu={closeMenu} />
      <PathwayModal open={open} onClose={closeEditPathwayModal} editPathway={editablePathway} />
    </div>
  );
};

export default memo(PathwaysTable);
