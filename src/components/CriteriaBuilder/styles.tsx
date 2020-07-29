import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.variables.spacing.globalPadding
    },
    elementContainer: {
      padding: '0',
      marginRight: '10px',
      border: '0.1em solid',
      borderRadius: '0.2em',
      fontWeight: 500,
      width: 'auto'
    },
    headerText: {
      marginRight: '10px',
      fontStyle: 'italic',
      fontSize: '0.8em'
    }
  }),
  { name: 'CriteriaBuilder' }
);
