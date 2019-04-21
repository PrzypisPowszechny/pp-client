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
import { tabPopupInit } from 'common/store/tabs/actions';
import { configureAxios } from '../common/axios';
import { waitUntilPageLoaded, waitUntilStoreReady } from '../common/utils/init';
import { selectAccessToken } from '../common/store/storage/selectors';
import { waitUntilContentScriptShouldHaveConnected, waitUntilCurrentTabLoaded } from './messages';
import { selectTab } from '../common/store/tabs/selectors';
import { contentScriptWontLoad, setTabUrl } from '../common/store/tabs/tab/tabInfo/actions';
import { getCurrentTabUrl } from './utils';

Promise.all([
  waitUntilPageLoaded(document),
])
  .then(() => {
    ReactDOM.render((
        <Provider store={store}>
          <BrowserPopupNavigator/>
        </Provider>
      ),
      document.body,
    );
  });

waitUntilStoreReady(store)
  .then(async () => {
    console.log('Store hydrated from background page.');
    // initialize tab state in the store
    await store.dispatch(tabPopupInit());

    const currentUrl = await getCurrentTabUrl();
    if (selectTab(store.getState()).tabInfo.currentUrl === null) {
      await store.dispatch(setTabUrl(currentUrl));
    }

    await waitUntilContentScriptShouldHaveConnected();
    if (!selectTab(store.getState()).tabInfo.contentScriptLoaded) {
      store.dispatch(contentScriptWontLoad());
    }

  });
