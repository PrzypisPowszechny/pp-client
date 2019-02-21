import * as sentry from '../common/sentry';

sentry.init();

console.log('Przypis Powszechny popup script working!');

// set script type for future introspection
setScriptType(ScriptType.popup);

// import Semantic-ui packages
import 'semantic-ui-css/semantic.min.css';

import '../../assets/icon.png';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';

import BrowserPopupNavigator from './components/BrowserPopupNavigator';
import { initializeTabId } from 'common/tab-id';
import { TAB_POPUP_INIT, tabPopupInit } from 'common/store/tabs/actions';
import { ScriptType, setScriptType } from 'common/meta';
import { getExtensionCookie } from '../common/messages';
import { configureAxios } from '../common/axios';
import { waitUntilPageAndStoreReady } from '../common/utils/init';

Promise.all([
  waitUntilPageAndStoreReady(store),
  initializeTabId(),
]).then(() => {
  console.log('Store hydrated from background page. Rendering components.');
  // initialize tab state in the store
  return store.dispatch(tabPopupInit());
}).then(() => {
  configureAxios(getExtensionCookie);

  ReactDOM.render(
    <Provider store={store}>
      <BrowserPopupNavigator/>
    </Provider>,
    document.body,
  );
});
