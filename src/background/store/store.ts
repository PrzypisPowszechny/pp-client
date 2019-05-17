import { applyMiddleware, createStore, Store } from 'redux';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';
import promise from 'redux-promise';
import thunk from 'redux-thunk';

import { alias, wrapStore } from 'webext-redux';
import deepDiff from 'webext-redux/lib/strategies/deepDiff/diff';

import actionAliases from 'common/store/action-aliases';
import { FluxStandardAction, rootEpic } from 'common/store/background-epics';
import rootReducer, { IState } from 'common/store/reducer';

import StorageSync from '../storage-sync';

const epicMiddleware = createEpicMiddleware<FluxStandardAction, FluxStandardAction, IState>();

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

/*
 * Result of async actions (the result of the promise) is by default ignored. By that we mean *value* of the
 * resolved promise is ignored, because the promise itself is resolved in right moment.
 * For the case of passing *value* the intended way is by explicitly wrapping it with { payload: value } object.
 * https://github.com/tshaddix/webext-redux/wiki/Advanced-Usage#how-does-this-work-under-the-hood
 */
const reduxPromiseResponder = (dispatchResult, send) => {
  Promise
    .resolve(dispatchResult) // pull out the promise
    .then((res) => {
      send({
        error: null,
        value: { payload: res },
      });
    })
    .catch((err) => {
      send({
        error: err,
        value: null,
      });
    });
};

export function initStore() {
  return storageSync.init()
    .then(() =>  {
      wrapStore(store, {
        portName: 'PP',
        diffStrategy: deepDiff,
        dispatchResponder: reduxPromiseResponder,
      });
      epicMiddleware.run(rootEpic);
    });

}

export default store;
