import React from 'react';
import { Provider } from 'react-redux';
import Enzyme from 'enzyme';
import AdapterReact16 from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';


jest.mock('common/pp-ga/ga', () => null);
jest.mock('common/chrome-storage', () => null);

import App from './App';

Enzyme.configure({ adapter: new AdapterReact16() });
const middlewares = [];
const mockStore = configureStore(middlewares);

describe('App component', () => {
  it('shallow renders without crashing', () => {
    const initialState = {};
    const store = mockStore(initialState);

    // TODO: currently Connect() wrapper is shallow rendered here and we would like to get to App itself
    Enzyme.shallow((
      <Provider store={store}>
        <App/>
      </Provider>
    ));
  });

  it('mounts without crashing', () => {
    const initialState = {
      widgets: {
        menu: {
          location: {
            x: 0,
            y: 0,
          },
          visible: false,
        },
        editor: {
          location: {
            x: 0,
            y: 0,
          },
          visible: false,
        },
        viewer: {
          location: {
            x: 0,
            y: 0,
          },
          visible: false,
          viewerItems: [],
          deleteModal: false,
          mouseOver: false,
        },
      },
      appModes: {
        isExtensionDisabled: false,
        disabledPages: [],
      },
    };

    const store = mockStore(initialState);

    Enzyme.mount((
      <Provider store={store}>
        <App/>
      </Provider>
    ));

  });
});
