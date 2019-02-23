import thunk from 'redux-thunk';
import promise from 'redux-promise';
import { createLogger } from 'redux-logger';
import { Store, applyMiddleware } from 'webext-redux';
import patchDeepDiff from 'webext-redux/lib/strategies/deepDiff/patch';

const middlewares = [thunk, promise];

if (PPSettings.DEV) {
  const logger = createLogger();
  middlewares.push(logger);
}
const proxyStore = new Store({
  portName: 'PP',
  patchStrategy: patchDeepDiff,
});

const storeWithMiddleware = applyMiddleware(proxyStore, ...middlewares);

export default storeWithMiddleware;
