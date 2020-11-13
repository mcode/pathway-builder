import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles((theme: AugmentedTheme) => ({
  root: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.secondary.main,
    padding: '15px 0px 15px 35px'
  },
  icon: {
    marginRight: '10px'
  },
  underline: {
    textDecoration: 'underline',
    '&:hover': {
      cursor: 'pointer'
    }
  }
}));
