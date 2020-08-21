import { makeStyles, Theme as AugmentedTheme } from '@material-ui/core/styles';

interface StyleProps {
  isActive?: boolean;
}

export default makeStyles(
  (theme: AugmentedTheme) => ({
    edges: {
      display: 'block',
      position: 'absolute',
      top: '0',
      left: '0',
      overflow: 'visible',
      width: '100%',
      height: '100%',
      zIndex: 1,
      '& text': {
        fontSize: '18px'
      },
      '& #arrowhead-inactive polygon': {
        fill: theme.palette.common.blue
      },
      '& #arrowhead-active polygon': {
        fill: theme.palette.common.red
      }
    },
    edge: {
      stroke: (props?: StyleProps) => theme.palette.common[props?.isActive ? 'red' : 'blue']
    }
  }),
  { name: 'DagreGraph-GraphEdges' }
);
