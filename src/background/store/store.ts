import { applyMiddleware, compose, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import rootReducer, { IState } from 'common/store/reducer';
import promise from 'redux-promise';
import { createLogger } from 'redux-logger';
import { wrapStore, alias } from 'react-chrome-redux';
import deepDiff from 'react-chrome-redux/lib/strategies/deepDiff/diff';
import actionAliases from 'common/store/action-aliases';

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

const wrappedStore = wrapStore(store, {
  portName: 'PP',
  diffStrategy: deepDiff,
});

export default wrappedStore;
