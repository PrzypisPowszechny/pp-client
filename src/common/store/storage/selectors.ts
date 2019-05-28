import { IUserState } from './types';
import { IState } from '../reducer';

export const selectStorage = state => baseSelectStorage(state, true);

export const trySelectStorage = state => baseSelectStorage(state, false);

export const baseSelectStorage = (state, raiseException: boolean) => {
  if (!state.storage || !state.storage.isHydrated) {
    if (raiseException) { throw new Error('state.storage not initialized'); }
    return null;
  }
  return state.storage.value;
};

export const selectUser = (state: IState) => {
  // "collect" user data from login data
  if (!trySelectStorage(state)) {
    return null;
  }
  const {
    userId,
    userEmail,
    userRole,
  } = selectStorage(state).auth;

  if (!userId) {
    return null;
  } else {
    return {
      userId,
      userEmail,
      userRole,
    };
  }
};

export const selectAccessToken = (state: IState): string => {
  const storage = selectStorage(state);
  if (storage && storage.auth) {
    return storage.auth.access || null;
  }
  return null;
};

export const selectUserForDashboard = (state: IState) => {
  const user = selectUser(state);
  if (!user) {
    return null;
  }
  const userData: Partial<IUserState> = {
    // It should include all relevant user info
    ...user,
  };

  const access = selectAccessToken(state);
  if (access) {
    userData.access = access;
  }
  return userData;
};
