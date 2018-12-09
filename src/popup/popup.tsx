import * as sentry from '../common/sentry';

sentry.init();

import React from 'react';
import ReactDOM from 'react-dom';
import BrowserPopup from './components/BrowserPopup';
// import Semantic-ui packages
import 'semantic-ui-css/semantic.min.css';
import './popup.scss';
import '../../assets/icon.png';
import { configureAxios } from '../common/axios';
import { getCurrentTabUrl } from './utils';

console.log('Przypis Powszechny popup script working!');

configureAxios(getCurrentTabUrl);

ReactDOM.render(
  <BrowserPopup/>,
  document.body,
);
