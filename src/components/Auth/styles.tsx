import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.variables.spacing.globalPadding
    },
    mainText: {
      fontFamily: 'RobotoCondensed-Light',
      fontSize: '65px',
      color: '#7D8892'
    },
    subText: {
      fontFamily: 'RobotoCondensed-Light',
      fontSize: '40px',
      color: '#AAAEB1'
    },
    tryItButton: {
      background: '#D95D77',
      boxShadow: '4px 4px 12px 0 rgba(0,0,0,0.50)',
      fontFamily: 'RobotoCondensed-Light',
      fontSize: '50px',
      color: '#FFFFFF',
      letterSpacing: '0px',
      textAlign: 'center',
      padding: '10px 90px 10px 90px'
    },
    exampleImage: {
      float: 'right',
      margin: '50px'
    },
    images: {
      padding: '10px'
    },
    homelink: {
      display: 'flex'
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '5em',
      backgroundColor: theme.palette.common.grayLighter,
      padding: '0 20px',
      width: '100%'
    },
    mitreButton: {
      cursor: 'pointer',
      padding: '10px',
      marginRight: '20px',
      marginLeft: 'auto',

      '&:focus': {
        outline: 'none'
      },
      '&:hover': {
        outline: 'none'
      }
    },
    mcodeButton: {
      cursor: 'pointer',
      padding: '10px',

      '&:focus': {
        outline: 'none'
      },
      '&:hover': {
        outline: 'none'
      }
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '8em',
      backgroundColor: theme.palette.common.grayLighter,
      padding: '0 20px'
    },

    signupButton: {
      backgroundColor: theme.palette.common.red,
      border: '10px',
      padding: '10px',
      fontFamily: 'RobotoCondensed-Regular',
      cursor: 'pointer',
      color: theme.palette.common.white,
      fontSize: '30px',
      marginRight: '20px',
      marginLeft: 'auto',

      '&:focus': {
        outline: 'none',
        svg: {
          fontSize: '30px'
        }
      },
      '&:hover': {
        outline: 'none',
        svg: {
          fontSize: '30px'
        }
      }
    },
    loginButton: {
      backgroundColor: theme.palette.common.white,
      border: '1px solid #7D8892',
      padding: '10px',
      fontFamily: 'RobotoCondensed-Regular',
      cursor: 'pointer',
      color: '#7D8892',
      fontSize: '30px',

      '&:focus': {
        outline: 'none',
        svg: {
          fontSize: '30px'
        }
      },
      '&:hover': {
        outline: 'none',
        svg: {
          fontSize: '30px'
        }
      }
    },
    modalHeader: {
      fontFamily: 'OpenSans-Semibold',
      fontSize: '80px',
      color: '#6A8AA4'
    },
    modalText: {
      fontFamily: 'OpenSans',
      fontSize: '30px',
      color: '#9B9B9B'
    },
    logo: {
      height: '50px'
    },
    homeLink: {
      display: 'flex'
    }
  }),
  { name: 'Auth', index: 1 }
);
