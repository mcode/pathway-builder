import { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';

export type RedirectToNodeCallback = (nodeId: string) => void;

const useRedirectToNode = (): RedirectToNodeCallback => {
  const { id: pathwayId } = useParams();
  const history = useHistory();
  const redirectToNode = useCallback(
    nodeId => {
      const url = `/demo/builder/${encodeURIComponent(pathwayId)}/node/${encodeURIComponent(
        nodeId
      )}`;
      if (url !== history.location.pathname) {
        history.push(url);
      }
    },
    [history, pathwayId]
  );

  return redirectToNode;
};

export default useRedirectToNode;
