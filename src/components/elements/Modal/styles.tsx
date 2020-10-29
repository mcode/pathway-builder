import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    root: {
      display: 'flex',
      padding: theme.variables.spacing.globalPadding
    },
    modalHeader: {
      fontSize: '4em',
      fontWeight: 600,
      margin: '-40px 0 10px',
      color: theme.palette.common.blue
    },
    closeIcon: {
      width: '20px',
      height: '20px',
      padding: '20px'
    },
    modalText: {
      fontSize: '1.5em',
      color: theme.palette.common.grayLighter,
      marginBottom: '40px'
    },
    submitButton: {
      fontSize: '1.3em',
      padding: '25px',
      '& span': {
        fontFamily: ['Roboto Condensed', 'sans-serif'].join(','),
        fontWeight: 400,
        lineHeight: '0.2em'
      }
    }
  }),
  { name: 'Modal', index: 1 }
);
