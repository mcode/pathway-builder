import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    textInput: {
      margin: '10px 0'
    },
    input: {
      width: '100%',
      '& input::placeholder': {
        color: theme.palette.common.grayDark,
        fontStyle: 'italic'
      }
    },
    icon: {
      color: theme.palette.common.grayBlueDark,
      marginRight: '20px'
    }
  }),
  { name: 'TextInput', index: 1 }
);
