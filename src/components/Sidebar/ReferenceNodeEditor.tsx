import React, { FC, memo, useCallback, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DropDown from 'components/elements/DropDown';
import useStyles from './styles';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';
import { useCurrentNodeContext } from 'components/CurrentNodeProvider';
import { nodeTypeOptions, redirect } from 'utils/nodeUtils';
import { Pathway, ReferenceNode } from 'pathways-model';
import { useHistory } from 'react-router-dom';
import { setNodeReference } from 'utils/builder';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useQueryCache, useQuery } from 'react-query';
import config from 'utils/ConfigManager';

interface ReferenceNodeEditorProps {
  changeNodeType: (event: string) => void;
}

const ReferenceNodeEditor: FC<ReferenceNodeEditorProps> = ({ changeNodeType }) => {
  const { currentNode, currentNodeRef } = useCurrentNodeContext();
  const { pathwayRef, setCurrentPathway } = useCurrentPathwayContext();
  const history = useHistory();
  const cache = useQueryCache();
  const baseUrl = config.get('pathwaysBackend');
  const [pathways, setPathways] = useState<Pathway[]>(
    (cache.getQueryData('pathways') as Pathway[]) || []
  );

  // Update local pathways state in case cache is out of date
  const { isLoading } = useQuery('pathways', () =>
    fetch(`${baseUrl}/pathway/`).then(res =>
      res.json().then(pathways => setPathways(pathways as Pathway[]))
    )
  );

  const pathwayOptions = pathways.map((pathway: Pathway) => {
    return {
      label: pathway.name,
      value: pathway.id
    };
  });
  const styles = useStyles();

  const showReference = useCallback((): void => {
    const pathwayReferenceId = (currentNode as ReferenceNode).referenceId;
    const referencedPathway = pathways.find(pathway => {
      return pathway.id === pathwayReferenceId;
    });
    if (referencedPathway) {
      setCurrentPathway(referencedPathway);
    }
  }, [currentNode, pathways, setCurrentPathway]);

  const selectPathwayReference = useCallback(
    (referenceId: string): void => {
      const referenceLabel =
        pathwayOptions.find(option => {
          return option.value === referenceId;
        })?.label || '';
      if (currentNodeRef.current && pathwayRef.current)
        setCurrentPathway(
          setNodeReference(
            pathwayRef.current,
            currentNodeRef.current.key,
            referenceId,
            referenceLabel
          )
        );
    },
    [currentNodeRef, pathwayOptions, pathwayRef, setCurrentPathway]
  );

  const changeNodeTypeEnabled = currentNode?.key && currentNode.type !== 'start';

  return (
    <>
      {changeNodeTypeEnabled && (
        <>
          <div>
            <DropDown
              id="nodeType"
              label="Node Type"
              options={nodeTypeOptions}
              onChange={changeNodeType}
              value="Reference"
            />
            <div className={styles.referenceDropdown}>
              <DropDown
                id="reference"
                label="Pathway Reference"
                options={pathwayOptions}
                onChange={selectPathwayReference}
                value={isLoading ? '' : (currentNode as ReferenceNode).referenceId}
              />
              <div className={styles.referenceChevron}>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  onClick={(): void => {
                    showReference();
                    redirect((currentNode as ReferenceNode).referenceId, '', history);
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default memo(ReferenceNodeEditor);
