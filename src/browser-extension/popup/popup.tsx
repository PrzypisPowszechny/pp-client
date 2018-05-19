import React from 'react';
import ReactDOM from 'react-dom';
import BrowserPopup from './BrowserPopup';
// import Semantic-ui packages
import 'semantic-ui-css/semantic.min.css';
import './popup.scss';
import '../../../assets/icon.png';

console.log('Przypis Powszechny popup script working!');

ReactDOM.render(
  <BrowserPopup/>,
  document.body,
);
