import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.variables.spacing.globalPadding
    },
    buttonRow: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    buildCriteriaButton: {
      alignSelf: 'flex-end',
      marginLeft: '20px'
    },
    criteriaList: {
      marginTop: '1em'
    },
    editButton: {
      marginRight: '1em'
    },
    dialogCloseButton: {
      float: 'right',
      width: '45px'
    },
    input: {
      display: 'none'
    },
    chooseFileInput: {
      display: 'flex',
      alignItems: 'center'
    },
    inputButton: {
      whiteSpace: 'nowrap',
      marginRight: '1em'
    },
    fileName: {
      fontStyle: 'italic'
    },
    tableTop: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    selectionOptions: {
      display: 'flex',
      paddingLeft: '4px',
      justifyContent: 'space-between',
      alignItems: 'flex-end'
    },
    selectionIcon: {
      color: theme.palette.primary.main
    },
    deleteIcon: {
      color: theme.palette.secondary.main
    }
  }),
  { name: 'CriteriaList', index: 1 }
);
