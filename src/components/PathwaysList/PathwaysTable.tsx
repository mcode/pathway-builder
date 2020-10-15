import React, { FC, memo, useState, useCallback, MouseEvent, useMemo, ChangeEvent } from 'react';
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

import { usePathwaysContext } from 'components/PathwaysProvider';
import PathwayModal from './PathwayModal';

import useStyles from './styles';
import { Pathway } from 'pathways-model';
import { Link as RouterLink } from 'react-router-dom';
import ConfirmedDeletionButton from 'components/ConfirmedDeletionButton';
import ExportMenu from 'components/elements/ExportMenu';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';

const PathwaysTable: FC = () => {
  const styles = useStyles();
  const { pathways, deletePathway } = usePathwaysContext();
  const { setCurrentPathway } = useCurrentPathwayContext();
  const [open, setOpen] = useState(false);
  const [editablePathway, setEditablePathway] = useState<Pathway>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

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

  const deletion = useCallback(
    (id: string): void => {
      deletePathway(id);
    },
    [deletePathway]
  );

  const numSelected = useMemo(() => selected.size, [selected.size]);
  const rowCount = useMemo(() => pathways.length, [pathways.length]);
  const indeterminate = useMemo(() => numSelected > 0 && numSelected < rowCount, [
    numSelected,
    rowCount
  ]);
  const checked = useMemo(() => rowCount > 0 && numSelected === rowCount, [numSelected, rowCount]);
  const handleSelectAllClick = useCallback(
    event => {
      if (event.target.checked) {
        const newSelected = new Set(pathways.map(n => n.id));
        setSelected(newSelected);
      } else setSelected(new Set());
    },
    [pathways]
  );
  const itemSelected = useCallback(
    item => {
      return selected.has(item);
    },
    [selected]
  );
  const handleSelectClick = useCallback((id: string) => {
    return (event: ChangeEvent<HTMLInputElement>): void => {
      event.target.checked
        ? setSelected(currentSelected => {
            currentSelected.add(id);
            return new Set(currentSelected);
          })
        : setSelected(currentSelected => {
            currentSelected.delete(id);
            return new Set(currentSelected);
          });
    };
  }, []);

  return (
    <div>
      <TableContainer className={styles.pathwayList}>
        <Table aria-label="pathway list">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={indeterminate}
                  checked={checked}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
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
      <ExportMenu anchorEl={anchorEl} closeMenu={closeMenu} />
      <PathwayModal open={open} onClose={closeEditPathwayModal} editPathway={editablePathway} />
    </div>
  );
};

export default memo(PathwaysTable);
