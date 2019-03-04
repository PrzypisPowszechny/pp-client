
export const waitUntilFirstStoreUpdate = store => new Promise((resolve) => {
  // Wait until Redux store first update before initializing components
  // so the store has been initialized with default reducers
  const unsubscribe = store.subscribe(() => {
    unsubscribe(); // make sure to only fire once
    resolve();
  });
});

export const waitUntilPageLoaded = () => new Promise(resolve => window.addEventListener('load', resolve));

export function waitUntilPageAndStoreReady(store) {
  return Promise.all([
    waitUntilFirstStoreUpdate(store),
    waitUntilPageLoaded(),
  ]);
}
