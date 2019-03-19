import { IUserState } from './reducers';

export const selectIsStorageInitialized = (state) => {
  return Boolean(state.storage && state.storage.isHydrated);
};

export const selectStorage = (state) => {
  if (!selectIsStorageInitialized(state)) {
    throw new Error('state.storage not initialized');
  }
  return state.storage.value;
};

export const selectUser = (state) => {
  // "collect" user data from login data
  if (!selectIsStorageInitialized(state)) {
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

export const selectAccessToken = (state): string => {
  const storage = selectStorage(state);
  if (storage && storage.auth) {
    return storage.auth.access || null;
  }
  return null;
};

export const selectUserForDashboard = (state) => {
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
