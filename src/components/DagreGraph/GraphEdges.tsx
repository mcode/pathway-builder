import React, { FC, ReactElement, memo, useMemo } from 'react';
import { Tooltip } from '@material-ui/core';

import { Label, Coordinate } from 'graph-model';
import { useGraphCoordinates } from './GraphProvider';
import useStyles from './GraphEdges.styles';
import { PathwayNode } from 'pathways-model';

interface EdgeProps {
  label: Label | null;
  points: Coordinate[];
  isActive: boolean;
}

interface LabelTooltipProps {
  labelText?: string | null;
  isEnabled: boolean;
  children: ReactElement;
}

const TRUNCATION_SIZE = 20;

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

const LabelTooltip: FC<LabelTooltipProps> = ({ labelText, isEnabled, children }) => {
  if (isEnabled && labelText) {
    return <Tooltip title={labelText} children={children} />;
  } else {
    return <>{children}</>;
  }
};

const Edge: FC<EdgeProps> = ({ label, points, isActive }) => {
  const styles = useStyles({ isActive });
  const path = useMemo(() => generatePathString(points), [points]);

  const labelText = label?.text;
  const { lines, isTruncated } = useMemo(() => {
    if (labelText == null) return { lines: [], isTruncated: false };

    let truncated = false;
    const allLines = labelText.split(',');
    const condensedLines =
      allLines.length > 3 ? [allLines[0], allLines[1], allLines.slice(2).join(',')] : allLines;

    const labelTextLines = condensedLines.map(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.length > TRUNCATION_SIZE) {
        truncated = true;
        return `${trimmedLine.substring(0, TRUNCATION_SIZE - 1)}...`;
      }
      return trimmedLine;
    });

    return { lines: labelTextLines, isTruncated: truncated };
  }, [labelText]);

  return (
    <>
      <path
        d={path}
        fill="transparent"
        className={styles.edge}
        strokeWidth="2"
        markerEnd={`url(#arrowhead-${isActive ? 'active' : 'inactive'})`}
      />
      {label && (
        <LabelTooltip labelText={labelText} isEnabled={isTruncated}>
          <text x={label.x} y={label.y} dy="0">
            {lines.map((line, index) => {
              return (
                <tspan x={label.x} dy={index === 0 ? 0 : '1.2em'} key={line}>
                  {line}
                </tspan>
              );
            })}
          </text>
        </LabelTooltip>
      )}
    </>
  );
};

interface GraphEdgesProps {
  currentNode: PathwayNode | null;
}

const GraphEdges: FC<GraphEdgesProps> = ({ currentNode }) => {
  const styles = useStyles();
  const { edges: edgeCoordinates } = useGraphCoordinates();

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
          <polygon points="0 0, 10 3.5, 0 7" />
        </marker>

        <marker
          id="arrowhead-active"
          markerWidth="10"
          markerHeight="7"
          refX="0"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" />
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
