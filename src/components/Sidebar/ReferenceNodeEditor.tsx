import React, { FC, memo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DropDown from 'components/elements/DropDown';
import useStyles from './styles';
import { useCurrentPathwayContext } from 'components/CurrentPathwayProvider';
import { nodeTypeOptions, redirect } from 'utils/nodeUtils';
import { Pathway, PathwayNode, ReferenceNode } from 'pathways-model';
import { useHistory } from 'react-router-dom';
import { setNodeReference } from 'utils/builder';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import usePathways from 'hooks/usePathways';
import useCurrentNodeStatic from 'hooks/useCurrentNodeStatic';

interface ReferenceNodeEditorProps {
  changeNodeType: (event: string) => void;
  currentNode: PathwayNode | null;
}

const ReferenceNodeEditor: FC<ReferenceNodeEditorProps> = ({ changeNodeType, currentNode }) => {
  const history = useHistory();
  const { isLoading, pathways } = usePathways();
  const { pathway, pathwayRef, setCurrentPathway } = useCurrentPathwayContext();
  const currentNodeStatic = useCurrentNodeStatic(pathway);

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
      if (currentNodeStatic && pathwayRef.current)
        setCurrentPathway(
          setNodeReference(pathwayRef.current, currentNodeStatic.key, referenceId, referenceLabel)
        );
    },
    [currentNodeStatic, pathwayOptions, pathwayRef, setCurrentPathway]
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
