import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from '../components/App';
import store from '../store';

export default {
  init,
  deinit,
};

function init() {
  const documentContainer = document.createElement('div');
  documentContainer.id = 'pp-document-container';
  window.document.body.appendChild(documentContainer);

  ReactDOM.render((
      <Provider store={store}>
        <App />
      </Provider>
    ),
    documentContainer,
  );
}

export function deinit() {
  // (todo) remove App component
}
