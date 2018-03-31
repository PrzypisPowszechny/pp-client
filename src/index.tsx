// import IPPSettings from './PPSettings.interface';
// declare const PP_SETTINGS: IPPSettings;

import React from 'react';
import ReactDOM from 'react-dom';

import IPPSettings from './PPSettings.interface';
declare const PP_SETTINGS: IPPSettings;

import Widget from "./components/Widget";
import Editor from "./components/Editor";
console.log('Przypis script working!');

function experimenting() {
  const documentContainer = document.createElement('div');
  documentContainer.id = "pp-document-container";
  window.document.body.appendChild(documentContainer);

  ReactDOM.render(
    <Editor locationX={100} locationY={300}> </Editor>,
    documentContainer
  );
}

const isBrowser = typeof window !== 'undefined';
if (isBrowser) {
  experimenting();
}
