import { useParams } from 'react-router-dom';

const useNodeId = (): string => {
  const { nodeId } = useParams<{ nodeId: string }>();
  return decodeURIComponent(nodeId);
};

export default useNodeId;
