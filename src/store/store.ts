import { applyMiddleware, compose, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import rootReducer, { apiInitializedFields, ITabState } from './reducer';
import promise from 'redux-promise';
import { createLogger } from 'redux-logger';
import { setAxiosConfig } from 'redux-json-api';

// TS override
declare global {
  interface Window { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any; }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const logger = createLogger();
const store: Store<ITabState> = createStore(
  rootReducer,
  {
    ...apiInitializedFields,
  } as ITabState,
  composeEnhancers(
    applyMiddleware(thunk, promise, logger),
  ),
);

store.dispatch(setAxiosConfig({
  baseURL: PP_SETTINGS.API_URL,
  withCredentials: true,
}));

export default store;
