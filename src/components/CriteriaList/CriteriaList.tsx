import React, { FC, memo, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools, faFileImport, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, Checkbox, IconButton, Tooltip } from '@material-ui/core';
import { useMutation, useQueryCache } from 'react-query';

import Loading from 'components/elements/Loading';
import CriteriaTable from './CriteriaTable';

import useStyles from './styles';
import FileImportModal from 'components/FileImportModal';
import useListCheckbox from 'hooks/useListCheckbox';
import ConfirmationPopover from 'components/elements/ConfirmationPopover';
import { deleteCriteria, readFile, updateCriteria } from 'utils/backend';
import { cqlToCriteria } from 'utils/criteria';
import useCriteria from 'hooks/useCriteria';
import JSZip from 'jszip';
import { CqlLibraries } from 'engine/cql-to-elm';

const CriteriaList: FC = () => {
  const styles = useStyles();
  const cache = useQueryCache();
  const { isLoading, criteria } = useCriteria();
  const [open, setOpen] = useState<boolean>(false);

  const {
    indeterminate,
    checked,
    handleSelectAllClick,
    itemSelected,
    handleSelectClick,
    selected,
    setSelected,
    numSelected
  } = useListCheckbox(isLoading ? [] : criteria.map(n => n.id));

  const openImportModal = useCallback((): void => {
    setOpen(true);
  }, []);

  const closeImportModal = useCallback((): void => {
    setOpen(false);
  }, []);

  const [mutateAddCriteria] = useMutation(updateCriteria, {
    onSettled: () => cache.invalidateQueries('criteria')
  });

  const addCqlCriteria = useCallback(
    (cql: string | CqlLibraries): void => {
      cqlToCriteria(cql).then(newCriteria => {
        // eslint-disable-next-line
        if (newCriteria.length) newCriteria.forEach(c => mutateAddCriteria(c));
        else alert('No valid criteria were found in the provided file');
      });
    },
    [mutateAddCriteria]
  );

  const addCriteria = useCallback(
    (files: FileList | undefined | null) => {
      if (files) {
        readFile(files[0], (event: ProgressEvent<FileReader>): void => {
          if (event.target?.result) {
            const rawContent = event.target.result as string;
            // TODO: more robust file type identification?
            if (files[0].name.endsWith('.cql')) {
              addCqlCriteria(rawContent);
            } else if (files[0].name.endsWith('.zip')) {
              const cqlLibraries: CqlLibraries = {};
              JSZip.loadAsync(files[0]).then(async zip => {
                const zipFiles = Object.values(zip.files);
                // Check for criteria in each of the cql files, add cql to libraries if no criteria
                for (let i = 0; i < zipFiles.length; i++) {
                  const zipFile = zipFiles[i];

                  // Skip files that do not end with .cql
                  if (!zipFile.name.endsWith('.cql')) continue;
                  const fileContents = await zipFile.async('string');
                  cqlLibraries[zipFile.name] = { cql: fileContents };
                }
                addCqlCriteria(cqlLibraries);
              });
            }
          } else alert('Unable to read that file');
        });
      }
      closeImportModal();
    },
    [closeImportModal, addCqlCriteria]
  );

  const [mutateDelete] = useMutation(deleteCriteria, {
    onSettled: () => cache.invalidateQueries('criteria')
  });

  const handleDelete = useCallback(() => {
    selected.forEach(id => {
      mutateDelete(id);
      setSelected(new Set());
    });
  }, [selected, setSelected, mutateDelete]);

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
              <Tooltip placement="top" title="Delete" arrow>
                <ConfirmationPopover
                  onConfirm={handleDelete}
                  displayText={`Are you sure that you would like to delete the selected ${
                    numSelected > 1 ? 'criteria' : 'criterion'
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
            className={styles.buildCriteriaButton}
            variant="contained"
            color="primary"
            startIcon={<FontAwesomeIcon icon={faFileImport} />}
            onClick={openImportModal}
          >
            Import Library
          </Button>
          <Button
            className={styles.buildCriteriaButton}
            variant="contained"
            color="primary"
            startIcon={<FontAwesomeIcon icon={faTools} />}
          >
            Build Criteria
          </Button>
        </div>
      </div>

      <FileImportModal
        open={open}
        onClose={closeImportModal}
        onSelectFile={addCriteria}
        allowedFileType=".cql, .zip"
      />

      {isLoading && <Loading />}
      {!isLoading && criteria && (
        <CriteriaTable handleSelectClick={handleSelectClick} itemSelected={itemSelected} />
      )}
    </div>
  );
};

export default memo(CriteriaList);
