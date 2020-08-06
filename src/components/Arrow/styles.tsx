import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    arrow: {
      '& path': {
        stroke: theme.palette.primary.main,
        strokeWidth: 2
      },
      '& text': {
        fontSize: '18px'
      }
    },
    currentArrow: {
      '& path': {
        stroke: theme.palette.secondary.main
      }
    },
    arrowhead: {
      '& polygon': {
        fill: theme.palette.primary.main
      }
    },
    currentArrowhead: {
      '& polygon': {
        fill: theme.palette.secondary.main
      }
    }
  }),
  { name: 'Arrow', index: 1 }
);
