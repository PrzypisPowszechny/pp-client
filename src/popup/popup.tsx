import * as sentry from '../common/sentry';

sentry.init();

console.log('Przypis Powszechny popup script working!');

// import Semantic-ui packages
import 'semantic-ui-css/semantic.min.css';

import './popup.scss';
import '../../assets/icon.png';

import React from 'react';
import ReactDOM from 'react-dom';

import initWindow from './init';
import BrowserPopupNavigator from './components/BrowserPopupNavigator';

window.addEventListener('load', () => {

  initWindow();

  ReactDOM.render(
    <BrowserPopupNavigator/>,
    document.body,
  );

});
