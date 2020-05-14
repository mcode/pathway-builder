import React, { FC, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import styles from './Sidebar.module.scss';
import { Button } from '@material-ui/core';

interface AddChoiceButtonProps {
  addChoiceNode: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// TODO: in PATHWAYS-256 Add choice needs to update the pathway with the new transition and state
const AddChoiceButton: FC<AddChoiceButtonProps> = ({ addChoiceNode }) => {
  return (
    <table>
      <tbody>
        <tr>
          <td className={styles.button}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FontAwesomeIcon icon={faPlus} />}
              onClick={addChoiceNode}
            >
              Add Choice Node
            </Button>
          </td>
          <td className={styles.description}>
            A logical choice for a clinical decision within a workflow.
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default memo(AddChoiceButton);
