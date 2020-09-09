import React, { FC, memo } from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';
import { useCriteriaContext } from 'components/CriteriaProvider';
import { downloadPathway } from 'utils/builder';

interface ExportMenuPropsInterface {
  anchorEl: HTMLElement | null;
  closeMenu: () => void;
}

const ExportMenu: FC<ExportMenuPropsInterface> = ({ anchorEl, closeMenu }) => {
  const { pathway } = useCurrentPathwayContext();
  const { criteria } = useCriteriaContext();

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
          if (pathway) downloadPathway(pathway, criteria);
          else alert('No pathway to download!');
          closeMenu();
        }}
      >
        Export Pathway
      </MenuItem>
      <MenuItem
        onClick={(): void => {
          if (pathway) downloadPathway(pathway, criteria, true);
          else alert('No pathway to download!');
          closeMenu();
        }}
      >
        Export to CPG
      </MenuItem>
    </Menu>
  );
};

export default memo(ExportMenu);