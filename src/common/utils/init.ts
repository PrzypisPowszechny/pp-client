import { initializeTabId } from '../store/tabs/tab-utils';

export const waitUntilFirstStoreUpdate = store => new Promise((resolve) => {
  // Wait until Redux store first update before initializing components
  // so the store has been initialized with default reducers
  const unsubscribe = store.subscribe(() => {
    unsubscribe(); // make sure to only fire once
    resolve();
  });
});

export const waitUntilPageLoaded = (document) => new Promise(resolve => {
  // in case the document is already rendered
  const state = document.readyState;
  if (state === 'complete') {
    setTimeout(resolve, 0); // additional timeout for rangy; todo find better solution
  } else {
    document.addEventListener('readystatechange', (event) => {
      if (event.target.readyState === 'complete') {
        resolve();
      }
    });
  }
});

export const waitUntilStoreReady = store => Promise.all([
  waitUntilFirstStoreUpdate(store),
  initializeTabId(), // initialize tab id for synchronous access in reducers
]);
