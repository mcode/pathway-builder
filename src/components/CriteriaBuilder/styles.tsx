import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.variables.spacing.globalPadding
    },
    elementContainer: {
      padding: '1em',
      marginRight: '10px',
      border: '0.1em solid',
      borderRadius: '0.2em',
      fontWeight: 500,
      width: 'auto',
      backgroundColor: theme.palette.common.grayLighter
    },
    elementSelect: {
      display: 'flex',
      alignItems: 'center'
    },
    addElementLabel: {
      marginLeft: '1em',
      minWidth: '120px'
    },
    headerText: {
      marginRight: '10px',
      fontStyle: 'italic',
      fontSize: '0.8em'
    },
    elementField: {
      display: 'flex',
      alignItems: 'center'
    },
    elementFieldLabel: {
      fontWeight: 'bold',
      marginRight: '1em'
    }
  }),
  { name: 'CriteriaBuilder' }
);
