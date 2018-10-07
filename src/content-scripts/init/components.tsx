import React from 'react';
import ReactDOM from 'react-dom';
import store from '../store/index';
import { Provider } from 'react-redux';
import App from '../components/App';

export function injectComponents() {
  const documentContainer = document.createElement('div');
  documentContainer.id = 'pp-document-container';
  window.document.body.appendChild(documentContainer);

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    documentContainer,
  );
}
