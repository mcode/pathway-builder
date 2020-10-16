import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

const selectionIconDefault = (theme: AugmentedTheme) => {
  return {
    color: theme.palette.primary.main,
    fontSize: '1.25em',
  }
};

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
    },
    tableTop: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    selectionOptions: {
      display: 'flex',
      paddingLeft: '4px',
      justifyContent: 'space-between',
      alignItems: 'center',
      '& > :not(:first-child)': {
        marginRight: '0.5em'
      }
    },
    selectionIcon: {
      ...selectionIconDefault(theme)
    },
    deleteIcon: {
      ...selectionIconDefault(theme),
      color: theme.palette.secondary.main,
    }
  }),
  { name: 'PathwaysList', index: 1 }
);
