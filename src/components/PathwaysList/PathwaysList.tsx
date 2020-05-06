import React, { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Pathway } from 'pathways-model';
import { Service } from 'pathways-objects';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@material-ui/core';

import Loading from 'components/elements/Loading/Loading';

import styles from './PathwaysList.module.scss';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  paper: {
    width: '60vw',
    backgroundColor: theme.palette.background.paper,
    padding: '4em',
    outline: 0
  },
  textField: {
    width: '100%'
  },
  inputBase: {
    color: theme.palette.common.black,
    borderColor: `${theme.palette.text.primary}!important`,
    '&:hover': {
      backgroundColor: theme.palette.common.white
    }
  },
  inputLabel: {
    color: `${theme.palette.common.black}!important`,
    fontStyle: 'italic'
  },
  createButton: {
    float: 'right',
    width: '25%',
    marginTop: '5em'
  },
  modalCloseButton: {
    float: 'right',
    '&:hover': {
      cursor: 'pointer'
    }
  }
}));

interface PathwaysTableProps {
  pathways: Pathway[];
  deleteButton: (pathway: Pathway) => void;
  editButton: (pathway: Pathway) => void;
}

const PathwaysTable: FC<PathwaysTableProps> = ({ pathways, deleteButton, editButton }) => {
  return (
    <TableContainer className={styles.pathwayList}>
      <Table aria-label="pathway list">
        <TableHead>
          <TableRow>
            <TableCell>Pathway Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Last Updated</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {pathways.map(pathway => (
            <TableRow key={pathway.name}>
              <TableCell component="th" scope="row">
                {pathway.name}
              </TableCell>
              <TableCell>draft</TableCell>
              <TableCell>2 days ago</TableCell>
              <TableCell align="right">
                <Button
                  className={styles.editButton}
                  color="primary"
                  size="small"
                  startIcon={<FontAwesomeIcon icon={faEdit} />}
                  onClick={(): void => editButton(pathway)}
                >
                  Edit
                </Button>

                <Button
                  color="secondary"
                  size="small"
                  startIcon={<FontAwesomeIcon icon={faTrashAlt} />}
                  onClick={(): void => deleteButton(pathway)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

interface PathwaysListProps {
  pathways: Pathway[];
  callback: Function;
  service: Service<Array<Pathway>>;
}

const PathwaysList: FC<PathwaysListProps> = ({ pathways, callback, service }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [newPathwayName, setNewPathwayName] = useState('');
  const [newPathwayDescription, setNewPathwayDescription] = useState('');
  if (service.status === 'loading') return <Loading />;

  const handleClose = (): void => {
    // closes modal and resets new pathway state
    setOpen(false);
    setNewPathwayName('');
    setNewPathwayDescription('');
  };

  const createNewPathway = (): void => {
    const newPathway = {
      name: newPathwayName,
      description: newPathwayDescription,
      library: '',
      criteria: [],
      states: {
        Start: {
          label: 'Start',
          transitions: []
        }
      }
    };
    pathways.push(newPathway);
    handleClose();
    callback(newPathway);
  };

  return (
    <div className={styles.root}>
      <Button
        className={styles.createPathwayButton}
        variant="contained"
        color="primary"
        startIcon={<FontAwesomeIcon icon={faPlus} />}
        onClick={(): void => setOpen(true)}
      >
        Create Pathway
      </Button>
      <Modal className={classes.modal} open={open} onClose={handleClose}>
        <div className={classes.paper}>
          {/* <Button
            className={classes.modalCloseButton}
            onClick={handleClose}
            startIcon={<FontAwesomeIcon icon={faTimes} />}
          /> */}
          <div className={classes.modalCloseButton} onClick={handleClose}>
            <FontAwesomeIcon icon={faTimes} size="lg" color="gray" />
          </div>
          <div>
            <TextField
              className={classes.textField}
              label="Pathway Name"
              value={newPathwayName}
              variant="outlined"
              onChange={(event): void => setNewPathwayName(event.target.value)}
              InputLabelProps={{
                className: classes.inputLabel
              }}
              InputProps={{
                classes: {
                  input: classes.inputBase,
                  notchedOutline: classes.inputBase
                }
              }}
            />
          </div>
          <div className={styles.textField}>
            <TextField
              className={classes.textField}
              label="Pathway Description"
              value={newPathwayDescription}
              variant="outlined"
              onChange={(event): void => setNewPathwayDescription(event.target.value)}
              InputLabelProps={{
                className: classes.inputLabel
              }}
              InputProps={{
                classes: {
                  input: classes.inputBase,
                  notchedOutline: classes.inputBase
                }
              }}
            />
          </div>
          <Button
            className={classes.createButton}
            variant="contained"
            color="primary"
            startIcon={<FontAwesomeIcon icon={faPlus} />}
            onClick={createNewPathway}
          >
            Create
          </Button>
        </div>
      </Modal>

      <PathwaysTable
        pathways={pathways}
        deleteButton={(): void => {
          // do nothing for now -- TODO: implement delete
        }}
        editButton={(pathway: Pathway): void => callback(pathway)}
      />
    </div>
  );
};

export default PathwaysList;
