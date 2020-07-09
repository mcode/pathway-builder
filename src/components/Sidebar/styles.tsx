import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.variables.spacing.globalPadding,
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.grey['800'],
      width: '33%',
      minWidth: '500px',
      overflowY: 'scroll',
      float: 'left'
    },
    formControl: {
      margin: theme.spacing(1, 0),
      minWidth: 375
    },
    divider: {
      width: '100%'
    },
    headerLabelStart: {
      cursor: 'default'
    },
    displayText: {
      margin: '0 0 5px 0',
      fontWeight: 900,
      fontSize: '1em'
    },
    sidebarHeader: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    sidebarHeaderGroup: {
      display: 'flex',
      alignItems: 'center'
    },
    sidebarHeaderButton: {
      height: '45px',
      width: '45px',
      color: theme.palette.text.primary
    },
    headerLabelGroup: {
      display: 'flex',
      cursor: 'pointer',
      height: '60px'
    },
    headerLabel: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '1.6em',
      fontWeight: 700,
      margin: '0 5px'
    },
    headerLabelText: {
      marginBottom: '5px'
    },
    editIcon: {
      fontSize: '0.6em',
      marginLeft: '10px'
    },
    sidebarButtonGroup: {
      display: 'flex',
      margin: '10px 0'
    },
    sidebarButton: {
      minWidth: 180,
      marginRight: '20px'
    },
    sidebarButtonText: {
      fontStyle: 'italic'
    },
    outlinedDiv: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      '& div': {
        width: '100%'
      }
    },
    outlinedDivError: {
      borderColor: `${theme.palette.error.main} !important`,
      '&:hover': {
        borderColor: `${theme.palette.error.main} !important`
      }
    },
    toggleSidebar: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      float: 'left',
      width: '50px',
      minWidth: '50px',
      height: '50px',
      fontSize: '2em',
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.text.primary,
      '&:hover': {
        cursor: 'pointer'
      }
    },
    cancelButton: {
      alignSelf: 'flex-end',
      marginTop: '5px',
      padding: '5px 15px',
      fontSize: '1em'
    },
    outlinedDiv: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      '& div': {
        width: '100%'
      }
    },
    outlinedDivError: {
      borderColor: `${theme.palette.error.main} !important`,
      '&:hover': {
        borderColor: `${theme.palette.error.main} !important`
      }
    },
    buildCriteriaContainer: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    saveButton: {
      marginLeft: '1em'
    }
  }),
  { name: 'Sidebar' }
);
