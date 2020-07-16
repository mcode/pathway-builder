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
      border: '0.1em solid',
      borderRadius: '0.2em',
      fontWeight: 500,
      width: '100%'
    }
  }),
  { name: 'CriteriaBuilder' }
);
