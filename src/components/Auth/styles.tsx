import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    landing: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '7em',
      backgroundColor: theme.palette.common.grayLightest,
      padding: '0 4em'
    },
    logoLink: {
      display: 'block'
    },
    logo: {
      height: '5em'
    },
    headerButtons: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    authButton: {
      padding: '30px',
      fontSize: '1.5em',
      '& span': {
        fontFamily: ['Roboto Condensed', 'sans-serif'].join(','),
        fontWeight: 400,
        lineHeight: '0.2em'
      }
    },
    signupButton: {
      backgroundColor: theme.palette.common.red,
      color: theme.palette.common.white,
      marginRight: '20px',
      marginLeft: 'auto',
      '&:hover': {
        backgroundColor: theme.palette.common.redDark
      }
    },
    loginButton: {
      backgroundColor: theme.palette.common.white,
      border: '1px solid',
      borderColor: theme.palette.common.grayBlueDark,
      color: theme.palette.common.grayBlueDark,
      '&:hover': {
        color: theme.palette.common.grayVeryDark
      }
    },
    tryItButton: {
      height: '60px',
      width: '200px',
      marginBottom: '1em',
      '& button': {
        backgroundColor: theme.palette.common.red,
        color: theme.palette.common.white,
        boxShadow: '4px 4px 12px 0 rgba(0,0,0,0.50)',
        fontSize: '2.5em',
        height: '100%',
        width: '100%'
      },
      '& button:hover': {
        backgroundColor: theme.palette.common.redDark
      },
      '& button span': {
        fontFamily: ['Roboto Condensed', 'sans-serif'].join(','),
        fontWeight: 400,
        textTransform: 'none',
        lineHeight: '0.2em'
      }
    },
    landingBody: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      flex: '1',
      margin: '4em'
    },
    landingContent: {
      display: 'flex',
      flexDirection: 'column',
      marginRight: '10em'
    },
    text: {
      fontFamily: ['Roboto Condensed', 'sans-serif'].join(','),
      fontWeight: 300,
      lineHeight: '1.2em'
    },
    mainText: {
      fontSize: '4em',
      color: theme.palette.common.grayBlueDark,
      marginBottom: '0.5em'
    },
    subText: {
      fontSize: '2.5em',
      color: theme.palette.common.grayLighter,
      marginBottom: '2em',
      width: '80%'
    },
    link: {
      fontWeight: 500,
      color: theme.palette.common.blue,
      '&:hover': {
        color: theme.palette.common.blueDark
      }
    },
    socialMedia: {
      display: 'flex',
      color: theme.palette.common.grayDark
    },
    iconGithub: {
      fontSize: '3em'
    },
    iconEmail: {
      marginLeft: '5px',
      color: theme.palette.common.white,
      '& svg': {
        fontSize: '1.8em',
        padding: '5px'
      }
    },
    iconEmailCircle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: theme.palette.common.grayDark,
      borderRadius: '50%',
      width: '42px',
      height: '42px'
    },
    exampleImage: {
      width: '50%',
      maxWidth: '800px'
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: theme.palette.common.grayLightest,
      padding: '0.5em 4em'
    },
    footerLogo: {
      display: 'flex'
    },
    mitreLogo: {
      marginRight: '20px',
      height: '60px'
    },
    mcodeLogo: {
      height: '30px'
    }
  }),
  { name: 'Auth', index: 1 }
);
