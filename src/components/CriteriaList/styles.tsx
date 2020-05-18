import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.variables.spacing.globalPadding
    },
    buildCriteriaButton: {
      alignSelf: 'flex-end'
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
    }
  }),
  { name: 'CriteriaList' }
);
