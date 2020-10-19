import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      padding: '2em',
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      height: '6em',
      justifyContent: 'space-between'
    },
    backButton: {
      height: '45px',
      width: '45px'
    },
    navigationIcons: {
      fontSize: '20px',
      cursor: 'pointer'
    },
    pathwayName: {
      fontSize: '1.4em',
      marginLeft: '1.5em'
    }
  }),
  { name: 'Navigation', index: 1 }
);
