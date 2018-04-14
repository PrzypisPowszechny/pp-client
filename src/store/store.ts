import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducer';
import promise from 'redux-promise';
import { createLogger } from 'redux-logger';

const logger = createLogger();
const store = createStore(
  rootReducer,
  applyMiddleware(thunk, promise, logger),
);

export default store;
