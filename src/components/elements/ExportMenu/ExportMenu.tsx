import React, { FC, memo, useCallback } from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';
import { downloadPathway } from 'utils/builder';
import { Pathway } from 'pathways-model';
import usePathways from 'hooks/usePathways';
import useCriteria from 'hooks/useCriteria';

interface ContextualExportMenuProps {
  anchorEl: HTMLElement | null;
  closeMenu: () => void;
}

interface ExportMenuPropsInterface extends ContextualExportMenuProps {
  pathway: Pathway[] | null;
}

const ExportMenu: FC<ExportMenuPropsInterface> = ({ pathway, anchorEl, closeMenu }) => {
  const { pathways } = usePathways();
  const { criteria } = useCriteria();

  const exportPathway = useCallback(() => {
    if (pathway) downloadPathway(pathway, pathways, criteria);
    else alert('No pathway to download!');
    closeMenu();
  }, [pathway, pathways, criteria, closeMenu]);

  const exportCPG = useCallback(() => {
    if (pathway) downloadPathway(pathway, pathways, criteria, true);
    else alert('No pathway to download!');
    closeMenu();
  }, [pathway, pathways, criteria, closeMenu]);

  return (
    <Menu
      id="pathway-options-menu"
      anchorEl={anchorEl}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={closeMenu}
    >
      <MenuItem onClick={exportPathway}>
        Export Pathway{pathway?.length && pathway.length > 1 ? 's' : ''}
      </MenuItem>
      <MenuItem onClick={exportCPG}>Export to CPG</MenuItem>
    </Menu>
  );
};

const ContextualExportMenu: FC<ContextualExportMenuProps> = ({ anchorEl, closeMenu }) => {
  const { pathway } = useCurrentPathwayContext();

  return (
    <ExportMenu pathway={pathway ? [pathway] : null} anchorEl={anchorEl} closeMenu={closeMenu} />
  );
};

export default memo(ExportMenu);
export { ContextualExportMenu };
