import { useEffect, useRef, useState, MutableRefObject } from 'react';

function useRefState<T>(initialValue: T): [T, MutableRefObject<T>, Function] {
  const [state, setState] = useState<T>(initialValue);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  return [state, stateRef, setState];
}

export default useRefState;
