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
import { cqlToCriteria, jsonToCriteria } from 'utils/criteria';
import useCriteria from 'hooks/useCriteria';

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

  const addCriteria = useCallback(
    (files: FileList | undefined | null) => {
      if (files) {
        readFile(files[0], (event: ProgressEvent<FileReader>): void => {
          if (event.target?.result) {
            const rawContent = event.target.result as string;
            // TODO: more robust file type identification?
            if (files[0].name.endsWith('.json')) {
              const newCriteria = jsonToCriteria(rawContent);
              if (newCriteria) newCriteria.forEach(criteria => mutateAddCriteria(criteria)); // eslint-disable-line
            } else if (files[0].name.endsWith('.cql')) {
              cqlToCriteria(rawContent).then(newCriteria => {
                if (newCriteria.length)
                  newCriteria.forEach(criteria => mutateAddCriteria(criteria)); // eslint-disable-line
              });
            }
          } else alert('Unable to read that file');
        });
      }
    },
    [mutateAddCriteria]
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
        allowedFileType=".cql"
      />

      {isLoading && <Loading />}
      {!isLoading && criteria && (
        <CriteriaTable handleSelectClick={handleSelectClick} itemSelected={itemSelected} />
      )}
    </div>
  );
};

export default memo(CriteriaList);
