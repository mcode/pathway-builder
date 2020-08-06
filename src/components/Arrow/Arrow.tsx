import React, { FC } from 'react';
import { Edge, Coordinate } from 'graph-model';
import { PathwayNode } from 'pathways-model';
import useStyles from './styles';
import clsx from 'clsx';
import { Tooltip } from '@material-ui/core';

interface ArrowProps {
  edge: Edge;
  edgeName: string;
  widthOffset: number;
  currentNode: PathwayNode;
}

interface ArrowPathProps {
  points: Coordinate[];
  arrowheadId: string;
  widthOffset: number;
}

const Arrow: FC<ArrowProps> = ({ edge, edgeName, widthOffset, currentNode }) => {
  const styles = useStyles();
  const isCurrentArrow = edge.start === currentNode.key;
  const edgeNameNoWhitespace = edgeName.replace(' ', '');
  const arrowheadId = `arrowhead-${edgeNameNoWhitespace}`;

  const { label } = edge;
  return (
    <svg className={clsx(styles.arrow, isCurrentArrow && styles.currentArrow)}>
      <ArrowPath points={edge.points} arrowheadId={arrowheadId} widthOffset={widthOffset} />
      {label ? (
        label.text.length > 12 ? (
          <Tooltip title={label.text} aria-label="tooltip">
            <text x={label.x + widthOffset} y={label.y}>
              {label.text.substring(0, 11) + '...'}
            </text>
          </Tooltip>
        ) : (
          <text x={label.x + widthOffset} y={label.y}>
            {label.text}
          </text>
        )
      ) : null}
      <defs>
        <marker
          id={arrowheadId}
          className={clsx(isCurrentArrow ? styles.currentArrowhead : styles.arrowhead)}
          markerWidth="10"
          markerHeight="7"
          refX="0"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" />
        </marker>
      </defs>
    </svg>
  );
};

// Returns path for arrow from edge points
const ArrowPath: FC<ArrowPathProps> = ({ points, arrowheadId, widthOffset }) => {
  const pointsWithOffset = points.map(p => ({ x: p.x + widthOffset, y: p.y }));
  const length = pointsWithOffset.length;
  pointsWithOffset[length - 1].y -= 17.5;
  let pathString = `M ${pointsWithOffset[0].x} ${pointsWithOffset[0].y} `;

  /**
   * The points to use in the Cubic command is determined by the length of points array
   * If i % 3 is 0, use all points including the 1st point
   * If i % 3 is 1, use all points except the 1st point
   * If i % 3 is 2, use all points including the 1st point and reuse every 3rd point
   * We need points to be a multiple of 3 because the Cubic command expects 3 points
   */
  const writeCommandString = (remainder: number): string => {
    return pointsWithOffset.reduce((acc, point, i, arr) => {
      return i % 3 !== remainder
        ? acc
        : `${acc} C ${point.x} ${point.y} ${arr[i + 1].x} ${arr[i + 1].y} ${arr[i + 2].x}
        ${arr[i + 2].y}`;
    }, pathString);
  };

  pathString = writeCommandString(length % 3);

  return <path d={pathString} fill="transparent" markerEnd={`url(#${arrowheadId})`} />;
};

export default Arrow;
