import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

interface StyleProps {
  isActionable: boolean;
  isExpanded: boolean;
}

export default makeStyles(
  (theme: AugmentedTheme) => ({
    node: {
      position: 'absolute',
      width: 'auto',
      minWidth: ({ isExpanded }: StyleProps): string => (isExpanded ? '400px' : '100px'),
      maxWidth: '600px',
      minHeight: '50px',
      display: 'flex',
      alignItems: 'stretch',
      flexDirection: 'column',
      border: ({ isActionable }: StyleProps): string =>
        `1px solid ${theme.palette.common[isActionable ? 'red' : 'blue']}`,
      backgroundColor: theme.palette.common.white,
      zIndex: 2,
      overflow: 'hidden'
    },
    nodeTitle: {
      padding: theme.spacing(2),
      flex: '1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.palette.common.white,
      backgroundColor: ({ isActionable }: StyleProps): string =>
        theme.palette.common[isActionable ? 'red' : 'blue']
    },
    nodeContent: {
      padding: theme.spacing(2)
    },
    clickable: {
      cursor: 'pointer'
    }
  }),
  { name: 'DagreGraph-Node' }
);
