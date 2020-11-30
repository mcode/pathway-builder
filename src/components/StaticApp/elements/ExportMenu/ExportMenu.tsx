import React, { FC, memo, useState, useCallback } from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { useCurrentPathwayContext } from 'components/StaticApp/CurrentPathwayProvider';
import { useCriteriaContext } from 'components/StaticApp/CriteriaProvider';
import { downloadPathway } from 'utils/builder';
import { usePathwaysContext } from 'components/StaticApp/PathwaysProvider';
import { Pathway } from 'pathways-model';
import { Criteria } from 'criteria-model';
import Modal from 'components/elements/Modal';
import Loading from 'components/elements/Loading';

interface ContextualExportMenuProps {
  anchorEl: HTMLElement | null;
  closeMenu: () => void;
}

interface ExportMenuPropsInterface extends ContextualExportMenuProps {
  pathway: Pathway[] | null;
  allPathways: Pathway[];
  criteria: Criteria[];
}

const ExportMenu: FC<ExportMenuPropsInterface> = ({
  pathway,
  allPathways,
  criteria,
  anchorEl,
  closeMenu
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleCloseModal = useCallback(() => setShowModal(false), [setShowModal]);

  const handleDownload = useCallback(
    (cpg: boolean) => {
      if (pathway) {
        setShowModal(true);
        downloadPathway(pathway, allPathways, criteria, cpg).then(() => setShowModal(false));
      } else alert('No pathway to download!');
      closeMenu();
    },
    [pathway, allPathways, criteria, setShowModal, closeMenu]
  );

  const handleDownloadPathway = useCallback(() => handleDownload(false), [handleDownload]);

  const handleDownloadCPG = useCallback(() => handleDownload(true), [handleDownload]);

  return (
    <>
      <Menu
        id="pathway-options-menu"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        <MenuItem onClick={handleDownloadPathway}>
          Export Pathway{pathway?.length && pathway.length > 1 ? 's' : ''}
        </MenuItem>
        <MenuItem onClick={handleDownloadCPG}>Export to CPG</MenuItem>
      </Menu>

      <Modal
        handleShowModal={showModal}
        handleCloseModal={handleCloseModal}
        headerTitle="Pathway Exporting"
        headerSubtitle="Please wait while the pathway exports."
      >
        <Loading />
      </Modal>
    </>
  );
};

const ContextualExportMenu: FC<ContextualExportMenuProps> = ({ anchorEl, closeMenu }) => {
  const { pathway } = useCurrentPathwayContext();
  const { pathways } = usePathwaysContext();

  const { criteria } = useCriteriaContext();

  return (
    <ExportMenu
      pathway={pathway ? [pathway] : null}
      allPathways={pathways}
      criteria={criteria}
      anchorEl={anchorEl}
      closeMenu={closeMenu}
    />
  );
};

export default memo(ExportMenu);
export { ContextualExportMenu };
