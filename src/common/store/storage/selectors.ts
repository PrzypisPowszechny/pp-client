export const selectIsStorageInitialized = (state) => {
  return Boolean(state.storage && state.storage.isHydrated);
}

export const selectStorage = (state) => {
  if (!selectIsStorageInitialized(state)) {
    throw new Error('state.storage not initialized');
  }
  return state.storage.value;
}

export const selectUser = (state) => {
  // "collect" user data from login data
  if (!selectIsStorageInitialized(state)) {
    return null;
  }
  const {
    userId,
  } = selectStorage(state).auth;

  if (!userId) {
    return null;
  } else {
    // todo add user type
    return {
      userId,
    };
  }
}

export const selectAccessToken = (state) => {
  const storage = selectStorage(state);
  if (storage && storage.auth) {
    return storage.auth.access || null;
  }
  return null;
}

export const selectUserForDashboard = state => ({
  // It should inclue all relevant user info
  ...selectUser(state),
  access: selectAccessToken(state),
});
