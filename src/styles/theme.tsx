import { createMuiTheme } from '@material-ui/core/styles';
import deepmerge from 'deepmerge';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    variables: {
      spacing: {
        globalPadding: string;
      };
    };
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    variables?: {
      spacing?: {
        globalPadding?: string;
      };
    };
  }
}

declare module '@material-ui/core/styles/createPalette' {
  interface CommonColors {
    blue: string;
    blueLighter: string;
    red: string;
    gray: string;
    grayMedium: string;
    grayBlue: string;
    grayLighter: string;
    grayDark: string;
    grayVeryDark: string;
    green: string;
  }
}

const variables = {
  spacing: {
    globalPadding: '2em'
  }
};

const colors = {
  white: '#fff',
  black: '#222',
  red: '#d95d77',
  blue: '#5d89a1',
  blueLighter: '#9ad2f0',
  gray: '#4a4a4a',
  grayMedium: '#bbbdc0',
  grayBlue: '#cbd5df',
  grayLight: '#6c6c6c',
  grayLighter: '#eaeef2',
  grayDark: '#444',
  grayVeryDark: '#3a3a3a',
  green: '#2fa874'
};

const typography = {
  fontFamily: [
    'Open Sans',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Oxygen',
    'Ubuntu',
    'Cantarell',
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    'sans-serif'
  ].join(',')
};

const materialUiOverridesBase = {
  MuiButton: {
    root: {
      borderRadius: 0,
      height: '38px',
      '&$disabled': {
        backgroundColor: colors.grayMedium,
        color: colors.white
      }
    },
    contained: {
      '&$disabled': {
        backgroundColor: colors.grayMedium,
        color: colors.white
      }
    },
    label: {
      fontWeight: 600
    },
    iconSizeMedium: {
      '& > *:first-child': {
        fontSize: 14
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
  },
  MuiFormControl: {
    root: {
      margin: '10px 0'
    }
  },
  MuiFormLabel: {
    root: {
      fontStyle: 'italic',
      '&.Mui-error': {
        color: colors.white
      },
      '&.Mui-disabled': {
        color: colors.white
      }
    }
  },
  MuiInputBase: {
    root: {
      fontWeight: 600
    },
    input: {
      '&::selection': {
        color: colors.white,
        backgroundColor: colors.grayDark
      },
      '&:-webkit-autofill': {
        transitionDelay: '9999s',
        transitionProperty: 'background-color, color'
      },
      '&$disabled': {
        color: colors.white,
        backgroundColor: colors.grayDark
      }
    }
  },
  MuiTooltip: {
    tooltip: {
      fontSize: 14,
      backgroundColor: colors.black
    },
    arrow: {
      color: colors.black
    }
  },
  MuiOutlinedInput: {
    root: {
      borderRadius: '0'
    }
  },
  MuiSelect: {
    icon: {
      fontSize: '2em'
    }
  },
  MuiPaper: {
    rounded: {
      borderRadius: '0'
    }
  },
  MuiDialogTitle: {
    root: {
      padding: '1em'
    }
  },
  MuiDialogContent: {
    root: {
      padding: '0 4em'
    }
  },
  MuiDialogActions: {
    root: {
      padding: '2em 4em'
    }
  },
  MuiCard: {
    root: {
      overflow: 'visible'
    }
  },
  MuiIconButton: {
    root: {
      color: colors.gray,
      '&:disabled': {
        color: colors.grayMedium
      }
    },
    sizeSmall: {
      width: '20px',
      height: '20px',
      margin: '9px'
    }
  }
};

const materialUiOverridesDark = {
  MuiFormControl: {
    root: {
      '&:hover': {
        borderColor: colors.white
      }
    }
  },
  MuiFormLabel: {
    root: {
      color: colors.white,
      '&$focused': {
        color: colors.white
      }
    }
  },
  MuiInputBase: {
    root: {
      color: colors.white,
      '&:hover': {
        borderColor: colors.white,
        backgroundColor: colors.grayDark
      }
    }
  },
  MuiTooltip: {
    tooltip: {
      fontSize: 14
    }
  },
  MuiOutlinedInput: {
    root: {
      '&:hover': {
        borderColor: colors.white
      },
      '&:hover $notchedOutline': {
        borderColor: colors.white
      },
      '&$focused $notchedOutline': {
        borderColor: colors.white
      },
      '&$disabled $notchedOutline': {
        borderColor: colors.white
      }
    },
    notchedOutline: {
      borderColor: colors.white
    }
  },
  MuiSelect: {
    icon: {
      color: colors.white
    }
  },
  MuiMenuItem: {
    root: {
      color: colors.grayDark
    }
  },
  MuiIconButton: {
    root: {
      color: colors.white,
      '&:disabled': {
        color: colors.grayLight
      }
    }
  }
};

const paletteBase = {
  primary: {
    main: colors.blue
  },
  secondary: {
    main: colors.red
  },
  error: {
    main: colors.red
  },
  common: colors,
  background: {
    default: colors.grayLighter
  },
  text: {
    primary: colors.gray,
    secondary: colors.gray
  },
  grey: {
    800: colors.gray
  }
};

const lightTheme = createMuiTheme({
  typography: { ...typography },
  palette: { ...paletteBase },
  overrides: { ...materialUiOverridesBase },
  variables: { ...variables }
});

const darkTheme = createMuiTheme({
  typography: { ...typography },
  palette: deepmerge(paletteBase, {
    text: {
      primary: colors.white,
      secondary: colors.white
    }
  }),
  overrides: deepmerge(materialUiOverridesBase, materialUiOverridesDark),
  variables: { ...variables }
});

const projectorTheme = createMuiTheme({
  typography: { ...typography },
  palette: deepmerge(paletteBase, {
    background: {
      default: colors.grayBlue
    },
    text: {
      primary: colors.black,
      secondary: colors.black
    }
  }),
  overrides: { ...materialUiOverridesBase },
  variables: { ...variables }
});

export default lightTheme;
export { lightTheme, darkTheme, projectorTheme };
