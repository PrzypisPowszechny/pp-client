
export const selectIsStorageInitialized = (state) => {
  return Boolean(state.storage && state.storage.isHydrated);
}

export const selectStorage = (state) => {
  if (!selectIsStorageInitialized(state)) {
    throw new Error('state.storage not initialized');
  }
  return state.storage.value;
}
