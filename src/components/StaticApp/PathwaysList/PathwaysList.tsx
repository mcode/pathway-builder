import React, { FC, useCallback, useState, memo, useMemo, MouseEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileImport,
  faPlus,
  faFileDownload,
  faFileExport,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { Button, Checkbox, IconButton, Tooltip } from '@material-ui/core';

import { usePathwaysContext } from 'components/StaticApp/PathwaysProvider';
import Loading from 'components/elements/Loading';
import PathwaysTable from './PathwaysTable';
import PathwayModal from './PathwayModal';

import useStyles from 'components/PathwaysList/styles';
import FileImportModal from 'components/FileImportModal';
import useListCheckbox from 'hooks/useListCheckbox';
import { useCriteriaContext } from 'components/StaticApp/CriteriaProvider';
import ExportMenu from 'components/StaticApp/elements/ExportMenu';
import { Pathway } from 'pathways-model';
import ConfirmationPopover from 'components/elements/ConfirmationPopover';

const PathwaysList: FC = () => {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const { status, pathways, deletePathway } = usePathwaysContext();
  const [importPathwayOpen, _setImportPathwayOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const pathwayIds = useMemo(() => pathways.map(n => n.id), [pathways]);
  const {
    indeterminate,
    checked,
    handleSelectAllClick,
    itemSelected,
    handleSelectClick,
    selected,
    numSelected
  } = useListCheckbox(pathwayIds);
  const { criteria } = useCriteriaContext();

  const { addPathwayFromFile } = usePathwaysContext();

  const openNewPathwayModal = useCallback((): void => {
    setOpen(true);
  }, []);

  const closeNewPathwayModal = useCallback((): void => {
    setOpen(false);
  }, []);

  const selectFile = useCallback(
    (files: FileList | undefined | null) => {
      if (files?.length) addPathwayFromFile((files[0] as unknown) as File);
    },
    [addPathwayFromFile]
  );

  const closeMenu = useCallback((): void => {
    setAnchorEl(null);
  }, []);

  const openImportPathwayModal = useCallback((): void => _setImportPathwayOpen(true), []);

  const closeImportPathwayModal = useCallback((): void => _setImportPathwayOpen(false), []);

  const handleDelete = useCallback(() => {
    selected.forEach(id => {
      deletePathway(id);
    });
  }, [deletePathway, selected]);

  const [pathwaysToExport, setPathwaysToExport] = useState<Pathway[]>([]);
  const handleExportAll = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      setPathwaysToExport(pathways.filter(pathway => selected.has(pathway.id)));
      setAnchorEl(event.currentTarget);
    },
    [pathways, selected]
  );

  return (
    <div className={styles.root}>
      <div className={styles.tableTop}>
        <div className={styles.selectionOptions}>
          <Tooltip placement="top" title="Select All" arrow>
            <Checkbox
              indeterminate={indeterminate}
              checked={checked}
              onChange={handleSelectAllClick}
            />
          </Tooltip>
          {numSelected > 0 && (
            <>
              <Tooltip placement="top" title="Export" arrow>
                <IconButton size="small" onClick={handleExportAll}>
                  <FontAwesomeIcon icon={faFileDownload} className={styles.selectionIcon} />
                </IconButton>
              </Tooltip>
              <Tooltip placement="top" title="Move to" arrow>
                <IconButton size="small">
                  <FontAwesomeIcon icon={faFileExport} className={styles.selectionIcon} />
                </IconButton>
              </Tooltip>
              <Tooltip placement="top" title="Delete" arrow>
                <ConfirmationPopover
                  onConfirm={handleDelete}
                  displayText={`Are you sure that you would like to delete the selected pathway${
                    numSelected > 1 ? 's' : ''
                  }?`}
                >
                  <IconButton size="small">
                    <FontAwesomeIcon icon={faTrashAlt} className={styles.deleteIcon} />
                  </IconButton>
                </ConfirmationPopover>
              </Tooltip>
            </>
          )}
        </div>
        <div className={styles.buttonRow}>
          <Button
            className={styles.createPathwayButton}
            variant="contained"
            color="primary"
            startIcon={<FontAwesomeIcon icon={faFileImport} />}
            onClick={openImportPathwayModal}
          >
            Import Pathway
          </Button>

          <Button
            className={styles.createPathwayButton}
            variant="contained"
            color="primary"
            startIcon={<FontAwesomeIcon icon={faPlus} />}
            onClick={openNewPathwayModal}
          >
            Create Pathway
          </Button>
        </div>
      </div>

      <FileImportModal
        open={importPathwayOpen}
        onClose={closeImportPathwayModal}
        onSelectFile={selectFile}
        allowedFileType=".json"
      />

      <PathwayModal open={open} onClose={closeNewPathwayModal} />
      <ExportMenu
        pathway={pathwaysToExport}
        allPathways={pathways}
        criteria={criteria}
        anchorEl={anchorEl}
        closeMenu={closeMenu}
      />

      {status === 'loading' ? (
        <Loading />
      ) : (
        <PathwaysTable handleSelectClick={handleSelectClick} itemSelected={itemSelected} />
      )}
    </div>
  );
};

export default memo(PathwaysList);
