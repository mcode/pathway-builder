import { useParams } from 'react-router-dom';

const usePathwayId = (): string => {
  const { id } = useParams<{ id: string }>();
  return decodeURIComponent(id);
};

export default usePathwayId;
