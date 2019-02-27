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
  if (!selectIsStorageInitialized(state)) {
    return null;
  }
  const {
    userId,
  } = selectStorage(state).auth;

  if (!userId) {
    return null;
  } else {
    return {
      userId,
    };
  }
}
