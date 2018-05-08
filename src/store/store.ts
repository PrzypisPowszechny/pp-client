import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducer';
import promise from 'redux-promise';
import { createLogger } from 'redux-logger';
import {  setAxiosConfig } from 'redux-json-api';

// TS override
declare global {
  interface Window { __REDUX_DEVTOOLS_EXTENSION__: any; }
}

const logger = createLogger();
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunk, promise, logger),
);

store.dispatch(setAxiosConfig({
  baseURL: PP_SETTINGS.API_URL,
}));

export default store;
