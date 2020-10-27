import React, { FC, memo } from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';
import { downloadPathway } from 'utils/builder';
import { Pathway } from 'pathways-model';

interface ContextualExportMenuProps {
  anchorEl: HTMLElement | null;
  closeMenu: () => void;
}

interface ExportMenuPropsInterface extends ContextualExportMenuProps {
  pathway: Pathway[] | null;
}

const ExportMenu: FC<ExportMenuPropsInterface> = ({ pathway, anchorEl, closeMenu }) => {
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
      <MenuItem
        onClick={(): void => {
          if (pathway) downloadPathway(pathway);
          else alert('No pathway to download!');
          closeMenu();
        }}
      >
        Export Pathway{pathway?.length && pathway.length > 1 ? 's' : ''}
      </MenuItem>
      <MenuItem
        onClick={(): void => {
          if (pathway) downloadPathway(pathway, true);
          else alert('No pathway to download!');
          closeMenu();
        }}
      >
        Export to CPG
      </MenuItem>
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
