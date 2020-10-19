import React, { FC, useCallback, useState, memo, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileImport,
  faPlus,
  faFileDownload,
  faFileExport,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { Button, Checkbox, IconButton, Tooltip } from '@material-ui/core';

import { usePathwaysContext } from 'components/PathwaysProvider';
import Loading from 'components/elements/Loading';
import PathwaysTable from './PathwaysTable';
import PathwayModal from './PathwayModal';

import useStyles from './styles';
import FileImportModal from 'components/FileImportModal';
import useListCheckbox from './PathwaysListCheckbox';
import JSZip from 'jszip';
import { CaminoExporter } from 'utils/CaminoExporter';
import { useCriteriaContext } from 'components/CriteriaProvider';

const PathwaysList: FC = () => {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const { status, pathways, deletePathway } = usePathwaysContext();
  const [importPathwayOpen, _setImportPathwayOpen] = useState(false);
  const pathwayIds = useMemo(() => pathways.map(n => n.id), [pathways]);
  const {
    indeterminate,
    checked,
    handleSelectAllClick,
    itemSelected,
    handleSelectClick,
    selected,
    setSelected
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

  const openImportPathwayModal = useCallback((): void => _setImportPathwayOpen(true), []);

  const closeImportPathwayModal = useCallback((): void => _setImportPathwayOpen(false), []);

  const handleDelete = useCallback(() => {
    selected.forEach(id => {
      deletePathway(id);
      setSelected(new Set());
    });
  }, [deletePathway, selected, setSelected]);

  const [exporting, setExporting] = useState(false);

  const handleExportAll = useCallback(() => {
    setExporting(true);
    const zip = new JSZip();
    selected.forEach(id => {
      const selectedPathway = pathways.find(pathway => pathway.id === id);
      if (selectedPathway) {
        zip.file(
          `${selectedPathway.name}.json`,
          JSON.stringify(new CaminoExporter(selectedPathway, criteria).export(), undefined, 2)
        );
      }
    });
    zip.generateAsync({ type: 'blob' }).then(function(content) {
      // Temporarily create hidden <a> tag to download pathwayBlob
      // File name is set to <pathway-name>.json
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pathways.zip';
      a.click();
      window.URL.revokeObjectURL(url);
      setExporting(false);
    });
  }, [criteria, pathways, selected]);

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
          <Tooltip placement="top" title="Export" arrow>
            <IconButton size="small" onClick={handleExportAll} disabled={exporting}>
              <FontAwesomeIcon icon={faFileDownload} className={styles.selectionIcon} />
            </IconButton>
          </Tooltip>
          <Tooltip placement="top" title="Move to" arrow>
            <IconButton size="small">
              <FontAwesomeIcon icon={faFileExport} className={styles.selectionIcon} />
            </IconButton>
          </Tooltip>
          <Tooltip placement="top" title="Delete" arrow>
            <IconButton size="small" onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrashAlt} className={styles.deleteIcon} />
            </IconButton>
          </Tooltip>
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

      {status === 'loading' ? (
        <Loading />
      ) : (
        <PathwaysTable handleSelectClick={handleSelectClick} itemSelected={itemSelected} />
      )}
    </div>
  );
};

export default memo(PathwaysList);
