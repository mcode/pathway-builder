import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      padding: `0.2em 2em`,
      textTransform: 'none',
      fontSize: '1.2em',
      fontWeight: 100
    }
  }),
  { name: 'Tabs', index: 1 }
);
