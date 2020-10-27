import React, { FC, useCallback, useState, memo, MouseEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileImport,
  faPlus,
  faFileDownload,
  faFileExport,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { Button, Checkbox, IconButton, Tooltip } from '@material-ui/core';
import { useQuery, useQueryCache, useMutation } from 'react-query';

import Loading from 'components/elements/Loading';
import PathwaysTable from './PathwaysTable';
import PathwayModal from './PathwayModal';

import useStyles from './styles';
import FileImportModal from 'components/FileImportModal';
import useListCheckbox from 'hooks/useListCheckbox';
import ExportMenu from 'components/elements/ExportMenu';
import ConfirmationPopover from 'components/elements/ConfirmationPopover';
import config from 'utils/ConfigManager';
import { readFile, updatePathway } from 'utils/backend';
import { Pathway } from 'pathways-model';
import { deletePathway } from 'utils/backend';

const PathwaysList: FC = () => {
  const cache = useQueryCache();
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const [importPathwayOpen, _setImportPathwayOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const baseUrl = config.get('pathwaysBackend');

  const { isLoading, error, data } = useQuery('pathways', () =>
    fetch(`${baseUrl}/pathway/`).then(res => res.json())
  );

  const {
    indeterminate,
    checked,
    handleSelectAllClick,
    itemSelected,
    handleSelectClick,
    selected,
    numSelected
  } = useListCheckbox(isLoading ? [] : (data as Pathway[]).map(n => n.id));

  const openNewPathwayModal = useCallback((): void => {
    setOpen(true);
  }, []);

  const closeNewPathwayModal = useCallback((): void => {
    setOpen(false);
  }, []);

  const [mutateAddPathway] = useMutation(updatePathway, {
    onSettled: () => cache.invalidateQueries('pathways')
  });

  const addPathway = useCallback(
    (files: FileList | undefined | null) => {
      if (files) {
        readFile(files[0], (event: ProgressEvent<FileReader>): void => {
          if (event.target?.result) {
            const rawContent = event.target.result as string;
            const pathway = JSON.parse(rawContent) as Pathway;
            mutateAddPathway(pathway);
          }
        });
      }
    },
    [mutateAddPathway]
  );

  const closeMenu = useCallback((): void => {
    setAnchorEl(null);
  }, []);

  const openImportPathwayModal = useCallback((): void => _setImportPathwayOpen(true), []);

  const closeImportPathwayModal = useCallback((): void => _setImportPathwayOpen(false), []);

  const [mutateDelete] = useMutation(deletePathway, {
    onSettled: () => cache.invalidateQueries('pathways')
  });

  const handleDelete = useCallback(() => {
    selected.forEach(id => {
      mutateDelete(id);
    });
  }, [mutateDelete, selected]);

  const [pathwaysToExport, setPathwaysToExport] = useState<Pathway[]>([]);
  const handleExportAll = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      setPathwaysToExport((data as Pathway[]).filter(pathway => selected.has(pathway.id)));
      setAnchorEl(event.currentTarget);
    },
    [data, selected]
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
        onSelectFile={addPathway}
        allowedFileType=".json"
      />
      <PathwayModal open={open} onClose={closeNewPathwayModal} />
      <ExportMenu pathway={pathwaysToExport} anchorEl={anchorEl} closeMenu={closeMenu} />

      {isLoading && !error && <Loading />}
      {error && <div>ERROR: Unable to get pathways</div>}
      {data && (
        <PathwaysTable
          pathways={data}
          handleSelectClick={handleSelectClick}
          itemSelected={itemSelected}
        />
      )}
    </div>
  );
};

export default memo(PathwaysList);
