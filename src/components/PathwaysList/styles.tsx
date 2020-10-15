import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.variables.spacing.globalPadding
    },
    createPathwayButton: {
      alignSelf: 'flex-end',
      marginLeft: '20px'
    },
    pathwayList: {
      marginTop: '2em'
    },
    pathwaysListButton: {
      marginRight: '1em'
    },
    dialogCloseButton: {
      float: 'right',
      width: '45px'
    },
    buttonRow: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }),
  { name: 'PathwaysList', index: 1 }
);
