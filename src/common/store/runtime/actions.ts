import { AuthProcStages, AuthProviders, IAuthProcState } from './types';

export const SET_AUTH_PROC_STAGE = 'SET_AUTH_PROC_STAGE';

export function initiateAuthProc(provider: AuthProviders): { type: string, payload: IAuthProcState } {
  return {
    type: SET_AUTH_PROC_STAGE,
    payload: {
      stage: AuthProcStages.initiated,
      provider,
      msg: null,
    },
  };
}

export function failAuthProc(msg): { type: string, payload: Partial<IAuthProcState> } {
  return {
    type: SET_AUTH_PROC_STAGE,
    payload: {
      stage: AuthProcStages.failed,
      msg,
    },
  };
}

export function completeAuthProc(): { type: string, payload: Partial<IAuthProcState> } {
  return {
    type: SET_AUTH_PROC_STAGE,
    payload: {
      stage: AuthProcStages.completed,
    },
  };
}

export function cancelAuthProc(msg = ''): { type: string, payload: Partial<IAuthProcState> } {
  return {
    type: SET_AUTH_PROC_STAGE,
    payload: {
      stage: AuthProcStages.canceled,
      msg,
    },
  };
}
