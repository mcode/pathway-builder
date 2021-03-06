import React, { FC, memo, useState, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools, faFileImport, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, Checkbox, IconButton, Tooltip } from '@material-ui/core';

import { usePathwaysContext } from 'components/StaticApp/PathwaysProvider';
import Loading from 'components/elements/Loading';
import CriteriaTable from './CriteriaTable';

import useStyles from 'components/CriteriaList/styles';
import FileImportModal from 'components/FileImportModal';
import { useCriteriaContext } from 'components/StaticApp/CriteriaProvider';
import useListCheckbox from 'hooks/useListCheckbox';
import ConfirmationPopover from 'components/elements/ConfirmationPopover';

const CriteriaList: FC = () => {
  const styles = useStyles();
  const { status } = usePathwaysContext();

  const { criteria, addCriteria, deleteCriteria } = useCriteriaContext();

  const [open, setOpen] = useState<boolean>(false);

  const pathwayIds = useMemo(() => criteria.map(n => n.id), [criteria]);
  const {
    indeterminate,
    checked,
    handleSelectAllClick,
    itemSelected,
    handleSelectClick,
    selected,
    setSelected,
    numSelected
  } = useListCheckbox(pathwayIds);

  const openImportModal = useCallback((): void => {
    setOpen(true);
  }, []);

  const closeImportModal = useCallback((): void => {
    setOpen(false);
  }, []);

  const selectFile = useCallback(
    (files: FileList | undefined | null) => {
      if (files?.length) addCriteria(files[0]);
      closeImportModal();
    },
    [addCriteria, closeImportModal]
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
        allowedFileType=".cql, .zip"
      />

      {status === 'loading' ? (
        <Loading />
      ) : (
        <CriteriaTable handleSelectClick={handleSelectClick} itemSelected={itemSelected} />
      )}
    </div>
  );
};

export default memo(CriteriaList);
