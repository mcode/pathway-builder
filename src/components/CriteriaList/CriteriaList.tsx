import React, { FC, memo, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools, faFileImport, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, Checkbox, IconButton, Tooltip } from '@material-ui/core';
import { useQuery } from 'react-query';

import Loading from 'components/elements/Loading';
import CriteriaTable from './CriteriaTable';

import useStyles from './styles';
import config from 'utils/ConfigManager';
import FileImportModal from 'components/FileImportModal';
import { useCriteriaContext } from 'components/CriteriaProvider';
import useListCheckbox from 'hooks/useListCheckbox';
import ConfirmationPopover from 'components/elements/ConfirmationPopover';
import { Criteria } from 'criteria-model';

const CriteriaList: FC = () => {
  const styles = useStyles();
  const { addCriteria, deleteCriteria } = useCriteriaContext();
  const baseUrl = config.get('pathwaysBackend');

  const { isLoading, error, data } = useQuery('criteria', () =>
    fetch(`${baseUrl}/criteria/`).then(res => res.json())
  );

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
  } = useListCheckbox(isLoading ? [] : (data as Criteria[]).map(n => n.id));

  const openImportModal = useCallback((): void => {
    setOpen(true);
  }, []);

  const closeImportModal = useCallback((): void => {
    setOpen(false);
  }, []);

  const selectFile = useCallback(
    (files: FileList | undefined | null) => {
      if (files?.length) addCriteria(files[0]);
    },
    [addCriteria]
  );

  const handleDelete = useCallback(() => {
    selected.forEach(id => {
      deleteCriteria(id);
      setSelected(new Set());
    });
  }, [deleteCriteria, selected, setSelected]);

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
        onSelectFile={selectFile}
        allowedFileType=".cql"
      />

      {isLoading && !error && <Loading />}
      {error && <div>ERROR: Unable to get criteria</div>}
      {data && (
        <CriteriaTable
          criteria={data as Criteria[]}
          handleSelectClick={handleSelectClick}
          itemSelected={itemSelected}
        />
      )}
    </div>
  );
};

export default memo(CriteriaList);
