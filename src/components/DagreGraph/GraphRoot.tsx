import React, { FC, ReactNode, useEffect, useMemo, useRef } from 'react';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';

import { useSetGraphWidth, useGraphCoordinates } from './GraphProvider';
import useStyles from './GraphRoot.styles';

interface GraphRootProps {
  children: ReactNode | ReactNode[];
}

const GraphRoot: FC<GraphRootProps> = ({ children }) => {
  const styles = useStyles();
  const graphRef = useRef<HTMLDivElement>(null);
  const setGraphWidth = useSetGraphWidth();
  const { nodes: nodeCoordinates } = useGraphCoordinates();
  const graphWidth = useMemo(() => {
    return Math.ceil(
      150 +
        (nodeCoordinates !== undefined
          ? Object.values(nodeCoordinates)
              .map(({ x, width }) => x + width)
              .reduce((a, b) => Math.max(a, b), 0)
          : 0)
    );
  }, [nodeCoordinates]);
  const graphHeight = useMemo(() => {
    return Math.ceil(
      150 +
        (nodeCoordinates !== undefined
          ? Object.values(nodeCoordinates)
              .map(({ y, height }) => y + height)
              .reduce((a, b) => Math.max(a, b), 0)
          : 0)
    );
  }, [nodeCoordinates]);
  const rootStyles = useMemo(() => ({ width: `${graphWidth}px`, height: `${graphHeight}px` }), [
    graphWidth,
    graphHeight
  ]);

  useEffect(() => {
    const graphElement = graphRef.current;
    if (graphElement?.parentElement) {
      const { width } = graphElement.parentElement.getBoundingClientRect();
      setGraphWidth(Math.ceil(width));
      const sensor = new ResizeSensor(graphElement.parentElement, () => {
        const { width } = graphElement?.parentElement?.getBoundingClientRect() ?? { width: 0 };
        setGraphWidth(Math.ceil(width));
      });
      return (): void => {
        sensor.detach();
      };
    }
  }, [graphRef, setGraphWidth]);

  return (
    <div ref={graphRef} className={styles.root} style={rootStyles}>
      {children}
    </div>
  );
};

export default GraphRoot;
