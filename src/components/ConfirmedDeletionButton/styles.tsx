import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    container: {
      display: 'inline-block'
    },
    paper: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: '10px',
      border: '5px solid rgba(74, 74, 74, 0.5)',
      backgroundColor: theme.palette.grey['800'],
      color: 'white',
      padding: '0.5em',
      mozBackgroundClip: 'padding' /* Firefox 3.6 */,
      webkitBackgroundVlip: 'padding' /* Safari 4? Chrome 6? */,
      backgroundClip: 'padding-box' /* Firefox 4, Safari 5, Opera 10, IE 9 */
    },
    displayText: {
      marginRight: '4em',
      whiteSpace: 'nowrap'
    },
    buttons: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '2.5em',
      minHeight: '2em',
      cursor: 'pointer',
      borderRadius: '15%',
      marginRight: '0.5em'
    }
  }),
  { name: 'ConfirmedDeletionButton' }
);
