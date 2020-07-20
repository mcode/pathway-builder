import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.variables.spacing.globalPadding
    },
    createPathwayButton: {
      alignSelf: 'flex-end'
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
    }
  }),
  { name: 'PathwaysList', index: 1 }
);
