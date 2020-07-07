import { makeStyles, Theme as AugmentedTheme, darken } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    display: {
      display: 'flex'
    },
    graph: {
      width: '100%',
      height: '100%',
      'overflow-y': 'scroll'
    },
    graphHeader: {
      display: 'flex',
      height: '50px',
      backgroundColor: theme.palette.common.white,
      marginLeft: '1px'
    },
    graphHeaderText: {
      height: '50px',
      display: 'flex',
      width: '95%',
      backgroundColor: theme.palette.primary.main,
      alignItems: 'center',
      color: theme.palette.common.white,
      fontSize: '1.4em',
      paddingLeft: '1.5em'
    },
    toggleButton: {
      borderRadius: '0%',
      marginLeft: '1px',
      width: '5%',
      height: '50px',
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: darken(theme.palette.primary.main, 0.1)
      }
    }
  }),
  { name: 'Builder' }
);
