import { createMuiTheme } from '@material-ui/core/styles';

const colors = {
  white: '#fff',
  black: '#222',
  blue: '#5d89a1',
  red: '#d95d77',
  gray: '#4a4a4a',
  grayMedium: '#bbbdc0',
  grayBlue: '#cbd5df',
  grayLighter: '#eaeef2',
  green: '#2fa874'
};

const typography = {
  fontFamily:
    "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
};

const materialUiOverrides = {
  MuiButton: {
    root: {
      borderRadius: 0
    },
    label: {
      fontWeight: 600
    },
    iconSizeMedium: {
      '& > *:first-child': {
        fontSize: 12
      }
    },
    iconSizeSmall: {
      '& > *:first-child': {
        fontSize: 14
      }
    }
  },
  MuiTableHead: {
    root: {
      backgroundColor: colors.grayLighter
    }
  },
  MuiTableCell: {
    root: {
      fontSize: '1em'
    },
    head: {
      padding: '5px 16px',
      borderBottom: 'none'
    }
  }
};

const theme = createMuiTheme({
  typography: { ...typography },
  palette: {
    primary: {
      main: colors.blue
    },
    secondary: {
      main: colors.red
    },
    common: colors,
    background: {
      default: colors.grayLighter
    },
    text: {
      primary: colors.gray,
      secondary: colors.gray
    }
  },
  overrides: { ...materialUiOverrides }
});

const projectorTheme = createMuiTheme({
  typography: { ...typography },
  palette: {
    primary: {
      main: colors.blue
    },
    secondary: {
      main: colors.red
    },
    common: colors,
    background: {
      default: colors.grayBlue
    },
    text: {
      primary: colors.black,
      secondary: colors.black
    }
  },
  overrides: { ...materialUiOverrides }
});

export default theme;
export { theme, projectorTheme };
