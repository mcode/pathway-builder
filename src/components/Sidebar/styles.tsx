import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.variables.spacing.globalPadding,
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.common.gray,
      width: '33%',
      minWidth: '550px',
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
    sidebarButtonGroupExtraMargin: {
      display: 'flex',
      margin: '20px 0 10px 0'
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
    buildCriteriaContainer: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    saveButton: {
      marginLeft: '1em'
    },
    transitionContainer: {
      backgroundColor: theme.palette.common.grayVeryDark,
      padding: '0 15px 10px 15px',
      margin: '15px 0'
    },
    dividerHeader: {
      width: '100%',
      textTransform: 'uppercase',
      borderBottom: '1px solid ' + theme.palette.common.blueLighter,
      color: theme.palette.common.blueLighter,
      lineHeight: '0.1em',
      margin: '10px 0 20px',
      fontWeight: 800,
      paddingLeft: '15px',
      '& span': {
        background: theme.palette.common.gray,
        padding: '0 10px'
      }
    }
  }),
  { name: 'Sidebar', index: 1 }
);
