import * as sentry from '../common/sentry';

sentry.init();

console.log('Przypis Powszechny popup script working!');

// Set script type by importing (so ALL other imports are executed afterwards)
import './meta';

// import Semantic-ui packages
import 'semantic-ui-css/semantic.min.css';

import '../../assets/icon.png';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';

import BrowserPopupNavigator from './components/BrowserPopupNavigator';
import { initializeTabId } from 'common/tab-id';
import { tabPopupInit } from 'common/store/tabs/actions';
import { getExtensionCookie } from '../common/messages';
import { configureAxios } from '../common/axios';
import { waitUntilFirstStoreUpdate, waitUntilPageLoaded } from '../common/utils/init';
import { selectAccessToken } from '../common/store/storage/selectors';

// initialize id of the tab for which the popup is displayed
initializeTabId();
configureAxios(
  getExtensionCookie,
  () => selectAccessToken(store.getState()),
);

Promise.all([
  waitUntilPageLoaded(),
])
  .then(() => {
    ReactDOM.render(
      <Provider store={store}>
        <BrowserPopupNavigator/>
      </Provider>,
      document.body,
    );
  });

waitUntilFirstStoreUpdate(store)
  .then(() => {
    console.log('Store hydrated from background page.');
    // initialize tab state in the store
    return store.dispatch(tabPopupInit());
  })
