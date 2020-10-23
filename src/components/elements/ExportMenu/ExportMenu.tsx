import React, { FC, memo } from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';
import { useCriteriaContext } from 'components/CriteriaProvider';
import { downloadPathway } from 'utils/builder';
import { Pathway } from 'pathways-model';
import { Criteria } from 'criteria-model';

interface ContextualExportMenuProps {
  anchorEl: HTMLElement | null;
  closeMenu: () => void;
}

interface ExportMenuPropsInterface extends ContextualExportMenuProps {
  pathway: Pathway[] | null;
  criteria: Criteria[];
}

const ExportMenu: FC<ExportMenuPropsInterface> = ({ pathway, criteria, anchorEl, closeMenu }) => {
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
        Export Pathway{pathway?.length && pathway.length > 1 ? 's' : ''}
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

const ContextualExportMenu: FC<ContextualExportMenuProps> = ({ anchorEl, closeMenu }) => {
  const { pathway } = useCurrentPathwayContext();

  const { criteria } = useCriteriaContext();

  return (
    <ExportMenu
      pathway={pathway ? [pathway] : null}
      criteria={criteria}
      anchorEl={anchorEl}
      closeMenu={closeMenu}
    />
  );
};

export default memo(ExportMenu);
export { ContextualExportMenu };
