import React from 'react';
import Enzyme from 'enzyme';
import AdapterReact16 from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import ConnectedApp from './App';

jest.mock('common/pp-ga/ga', () => null);
jest.mock('common/chrome-storage', () => null);

Enzyme.configure({ adapter: new AdapterReact16() });
const middlewares = [];
const mockStore = configureStore(middlewares);

describe('App component', () => {
  it('shallow renders without crashing', () => {
    const initialState = {
      widgets: {
        menu: {
          visible: false,
        },
        editor: {
          visible: false,
        },
        viewer: {
          visible: false,
        },
        notification: {
          visible: false,
        },
      },
      appModes: {
        isExtensionDisabled: false,
        disabledPages: [],
      },
    };
    const store = mockStore(initialState);

    // Shallow render of the connect
    let wrapper = Enzyme.shallow(
      <ConnectedApp/>,
      { context: { store } },
    );
    expect(wrapper.find('App').length).toBeTruthy();
    const app = wrapper.getElement();

    // Shallow render of connect output - App instance
    wrapper = Enzyme.shallow(
      app,
      { context: { store } },
    );
    expect(wrapper.exists()).toBeTruthy();
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
        notification: {
          visible: false,
        },
      },
      appModes: {
        isExtensionDisabled: false,
        disabledPages: [],
      },
    };

    const store = mockStore(initialState);

    Enzyme.mount(
      <ConnectedApp/>,
      { context: { store } },
    );

  });
});
