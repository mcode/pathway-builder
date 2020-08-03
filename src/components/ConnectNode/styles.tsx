import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    connectDropdown: {
      margin: 'auto',
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      alignContent: 'center'
    },
    connectText: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      fontSize: '0.95em',
      fontStyle: 'italic'
    },
    cancelButton: {
      marginLeft: 'auto',
      border: 'none',
      alignSelf: 'center',
      color: theme.palette.common.blueLighter,
      fontSize: '1em',
      fontStyle: 'italic',
      textTransform: 'none'
    }
  }),
  { name: 'ConnectNode' }
);
