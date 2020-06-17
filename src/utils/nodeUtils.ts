import { State, GuidanceState } from 'pathways-model';

export function isGuidanceState(state: State): state is GuidanceState {
  const { action } = state as GuidanceState;
  return action ? action.length > 0 : false;
}

export function isBranchState(state: State): boolean {
  const { action, label } = state as GuidanceState;
  return action === undefined && label !== 'Start';
}
