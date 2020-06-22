import { State, GuidanceState } from 'pathways-model';

export function isGuidanceState(state: State): state is GuidanceState {
  const { action } = state as GuidanceState;
  return action !== undefined;
}

export function isBranchState(state: State): boolean {
  const { action, label } = state as GuidanceState;
  return action === undefined && label !== 'Start';
}
