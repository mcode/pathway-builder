import { makeStyles, Theme as AugmentedTheme, darken } from '@material-ui/core/styles';

const toggleButtonCss = {
  borderRadius: '0%',
  marginLeft: '1px',
  width: '50px',
  height: '50px'
};

export default makeStyles(
  (theme: AugmentedTheme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh'
    },
    main: {
      flex: '1',
      display: 'flex',
      alignItems: 'stretch',
      overflowY: 'auto'
    },
    graph: {
      'overflow-y': 'auto',
      flex: '1'
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
      width: '100%',
      backgroundColor: theme.palette.primary.main,
      alignItems: 'center',
      color: theme.palette.common.white,
      fontSize: '1.4em',
      paddingLeft: '1.5em'
    },
    toggleButton: {
      '&-on': {
        ...toggleButtonCss,
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: darken(theme.palette.primary.main, 0.1)
        }
      },
      '&-off': {
        ...toggleButtonCss,
        backgroundColor: theme.palette.text.primary,
        '&:hover': {
          backgroundColor: darken(theme.palette.text.primary, 0.1)
        }
      }
    },
    toggleIcon: {
      transform: 'rotate(90deg) scaleY(-1)',
      color: theme.palette.common.white
    }
  }),
  { name: 'Builder', index: 1 }
);
