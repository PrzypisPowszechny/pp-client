import { applyMiddleware, compose, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import rootReducer, { IState } from 'common/store/reducer';
import promise from 'redux-promise';
import { createLogger } from 'redux-logger';
import { wrapStore, alias } from 'webext-redux';
import deepDiff from 'webext-redux/lib/strategies/deepDiff/diff';
import actionAliases from 'common/store/action-aliases';
import StorageSync from '../storage-sync';
import { createEpicMiddleware } from 'redux-observable';
import { rootEpic } from 'common/store/background-epics';

const epicMiddleware = createEpicMiddleware();

const middlewares = [thunk, promise, epicMiddleware];

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

const storageSync = new StorageSync(
  store,
  state => state.storage,
  chrome.storage.local,
);

export function initStore() {
  return storageSync.init()
    .then(() =>  {
      wrapStore(store, {
        portName: 'PP',
        diffStrategy: deepDiff,
      });
      epicMiddleware.run(rootEpic);
    });

}

export default store;
