import { Pathway, PathwayNode } from 'pathways-model';
import { useParams } from 'react-router-dom';
const useCurrentNodeStatic = (pathway: Pathway | null): PathwayNode | undefined => {
  const { nodeId } = useParams<{ nodeId: string }>();
  const currentNodeId = decodeURIComponent(nodeId);
  const currentNodeStatic = pathway?.nodes[currentNodeId];
  return currentNodeStatic;
};
export default useCurrentNodeStatic;
