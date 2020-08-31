import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    icon: {
      marginRight: theme.spacing(1),
      fontSize: '0.9rem'
    }
  }),
  { name: 'DagreGraph-NodeIcon' }
);
