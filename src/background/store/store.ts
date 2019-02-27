import { applyMiddleware, compose, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import rootReducer, { IState } from 'common/store/reducer';
import promise from 'redux-promise';
import { createLogger } from 'redux-logger';
import { wrapStore, alias } from 'webext-redux';
import deepDiff from 'webext-redux/lib/strategies/deepDiff/diff';
import actionAliases from 'common/store/action-aliases';
import StorageSync from '../storage-sync';

const middlewares = [thunk, promise];

if (PPSettings.DEV) {
  const logger = createLogger();
  middlewares.push(logger);
}

const aliases = {
  ...actionAliases,
};

const store: Store<IState> = createStore(
  rootReducer,
  applyMiddleware(alias(aliases), ...middlewares),
);

wrapStore(store, {
  portName: 'PP',
  diffStrategy: deepDiff,
});

new StorageSync(
  store,
    state => state.storage,
  chrome.storage.local,
).init();

export default store;
