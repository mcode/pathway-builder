import React, { FC, ReactElement, memo, useMemo } from 'react';
import { Tooltip } from '@material-ui/core';
import { makeStyles, Theme as AugmentedTheme, useTheme } from '@material-ui/core/styles';

import { Label, Coordinate } from 'graph-model';
import { useCurrentNodeContext } from 'components/CurrentNodeProvider';
import { useGraphCoordinates } from './GraphProvider';

interface EdgeProps {
  label: Label | null;
  points: Coordinate[];
  isActive: boolean;
}

interface LabelTooltipProps {
  label: Label;
  children: ReactElement;
}

const useStyles = makeStyles(
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
      }
    }
  }),
  { name: 'DagreGraph-GraphEdges' }
);

/**
 * The points to use in the Cubic command is determined by the length of points array
 * If i % 3 is 0, use all points including the 1st point
 * If i % 3 is 1, use all points except the 1st point
 * If i % 3 is 2, use all points including the 1st point and reuse every 3rd point
 * We need points to be a multiple of 3 because the Cubic command expects 3 points
 */
const generatePathString = (points: Coordinate[]): string =>
  points.reduce(
    (path, point, i) =>
      i % 3 === points.length % 3
        ? `${path} C ${point.x} ${point.y} ${points[i + 1].x} ${points[i + 1].y} ${
            points[i + 2].x
          } ${points[i + 2].y}`
        : path,
    `M ${points[0].x} ${points[0].y} `
  );

const LabelTooltip: FC<LabelTooltipProps> = ({ label, children }) => {
  if (label.text.length > 12) {
    return <Tooltip title={label.text} children={children} />;
  } else {
    return <>{children}</>;
  }
};

const Edge: FC<EdgeProps> = ({ label, points, isActive }) => {
  const theme = useTheme();
  const path = useMemo(() => generatePathString(points), [points]);
  const truncateTooltip = label && label.text?.length > 12;

  return (
    <>
      <path
        d={path}
        fill="transparent"
        stroke={theme.palette.common[isActive ? 'red' : 'blue']}
        strokeWidth="2"
        markerEnd={`url(#arrowhead-${isActive ? 'active' : 'inactive'})`}
      />
      {label && (
        <LabelTooltip label={label}>
          <text x={label.x} y={label.y}>
            {truncateTooltip ? `${label.text.substring(0, 11)}...` : label.text}
          </text>
        </LabelTooltip>
      )}
    </>
  );
};

const GraphEdges: FC = () => {
  const styles = useStyles();
  const theme = useTheme();
  const { edges: edgeCoordinates } = useGraphCoordinates();
  const { currentNode } = useCurrentNodeContext();

  return (
    <svg className={styles.edges}>
      <defs>
        <marker
          id="arrowhead-inactive"
          markerWidth="10"
          markerHeight="7"
          refX="0"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill={theme.palette.common.blue} />
        </marker>

        <marker
          id="arrowhead-active"
          markerWidth="10"
          markerHeight="7"
          refX="0"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill={theme.palette.common.red} />
        </marker>
      </defs>

      {Object.entries(edgeCoordinates).map(([edgeId, edge]) => (
        <Edge
          key={edgeId}
          label={edge.label}
          points={edge.points}
          isActive={edge.start === currentNode?.key}
        />
      ))}
    </svg>
  );
};

export default memo(GraphEdges);
