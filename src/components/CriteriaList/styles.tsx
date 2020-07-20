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
      marginTop: '2em'
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
    }
  }),
  { name: 'CriteriaList', index: 1 }
);
