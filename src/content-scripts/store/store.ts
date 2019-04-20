import thunk from 'redux-thunk';
import promise from 'redux-promise';
import { createLogger } from 'redux-logger';
import { Store, applyMiddleware } from 'webext-redux';
import patchDeepDiff from 'webext-redux/lib/strategies/deepDiff/patch';
import { getTabId } from 'common/store/tabs/tab-utils';

const middlewares = [thunk, promise];

function tabOnlyPatch(obj, difference: any[]) {
  const tabId = getTabId();
  if (difference.every(item =>
    item.key === 'tabs' && item.value.every(subitem => subitem.key !== tabId.toString(),
    ))) {
    console.debug('Ignoring patch (not applicable):', difference);
    return obj;
  }

  return patchDeepDiff(obj, difference);
}

if (PPSettings.DEV) {
  const logger = createLogger();
  middlewares.push(logger);
}
const proxyStore = new Store({
  portName: 'PP',
  patchStrategy: tabOnlyPatch,
});


const storeWithMiddleware = applyMiddleware(proxyStore, ...middlewares);

export default storeWithMiddleware;
