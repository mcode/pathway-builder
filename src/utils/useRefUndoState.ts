import { useEffect, useRef, useState, MutableRefObject, useCallback } from 'react';
import useUndo from 'use-undo';

function useRefUndoState<T>(initialValue: T): [T, MutableRefObject<T>, boolean, boolean, Function, Function, Function] {
    const [
        state,
        {
            set: setState,
            undo: undoState,
            redo: redoState,
            canUndo,
            canRedo
        }
    ] = useUndo<T>(initialValue);
    const stateRef = useRef(state.present);

    useEffect(() => {
        stateRef.current = state.present;
    }, [state]);

    return [state.present, stateRef, canUndo, canRedo, undoState, redoState, setState];
}

export default useRefUndoState;