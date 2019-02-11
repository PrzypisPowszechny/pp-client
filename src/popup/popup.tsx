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

import initWindow from './init';
import BrowserPopupNavigator from './components/BrowserPopupNavigator';
import { initializeTabId } from 'common/store/tab-init';
import { TAB_INIT } from '../common/store/tabs/actions';
import { ScriptType, setScriptType } from '../common/meta';

// Wait until first update before initializing components so the store has been initialized with default reducers
const waitUntilFirstUpdate = new Promise((resolve) => {
  const unsubscribe = store.subscribe(() => {
    unsubscribe(); // make sure to only fire once
    resolve();
  });
});

const waitUntilPageLoaded = new Promise((resolve) => {
  window.addEventListener('load', () => {
    resolve();
  });
});

Promise.all([
  initWindow(),
  waitUntilFirstUpdate,
  waitUntilPageLoaded,
  initializeTabId(),
]).then(() => {
  console.log('Store hydrated from background page. Rendering components.');
  // initialize tab state in the store
  return store.dispatch({ type: TAB_INIT });
}).then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <BrowserPopupNavigator/>
    </Provider>,
    document.body,
  );
});
