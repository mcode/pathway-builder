import { useState, useCallback } from 'react';

export interface ExpandedState {
  [key: string]: boolean | string | null;
}

interface ExpandedStateToggle {
  expanded: ExpandedState;
  toggleExpanded: (nodeName: string) => void;
  openNode: (nodeName: string) => void;
  closeNode: (nodeName: string) => void;
}

const useExpandedState = (): ExpandedStateToggle => {
  const [expanded, setExpanded] = useState<ExpandedState>({
    lastSelectedNode: null
  } as ExpandedState);

  const toggleExpanded = useCallback((nodeName: string) => {
    if (nodeName === 'Start') {
      setExpanded(prevState => ({
        ...prevState,
        lastSelectedNode: nodeName
      }));
    } else {
      setExpanded(prevState => ({
        ...prevState,
        [nodeName]:
          !prevState[nodeName] || prevState.lastSelectedNode === nodeName
            ? !prevState[nodeName]
            : prevState[nodeName],
        lastSelectedNode: nodeName
      }));
    }
  }, []);

  const openNode = useCallback((nodeName: string) => {
    setExpanded(prevState => {
      if (prevState[nodeName] && prevState.lastSelectedNode === nodeName) return prevState;

      return {
        ...prevState,
        [nodeName]: true,
        lastSelectedNode: nodeName
      };
    });
  }, []);

  const closeNode = useCallback((nodeName: string) => {
    setExpanded(prevState => {
      if (!prevState[nodeName]) return prevState;

      return {
        ...prevState,
        [nodeName]: false
      };
    });
  }, []);

  return { expanded, toggleExpanded, openNode, closeNode };
};

export default useExpandedState;
