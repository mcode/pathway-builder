import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

export default makeStyles(
  (theme: AugmentedTheme) => ({
    table: {
      '& tr': {
        verticalAlign: 'top'
      }
    },
    title: {
      fontWeight: 'bold',
      textAlign: 'right',
      minWidth: '80px'
    },
    description: {
      paddingLeft: theme.spacing(2),
      fontStyle: 'italic',
      overflowWrap: 'break-word'
    },
    externalLink: {
      color: theme.palette.common.blue,
      marginLeft: theme.spacing(1),

      '&:hover, &:focus': {
        color: theme.palette.common.grayDark
      }
    }
  }),
  { name: 'ExpandedNode' }
);
