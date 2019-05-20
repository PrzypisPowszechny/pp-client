import React from 'react';
import configureStore from 'redux-mock-store';

import Enzyme from 'enzyme';
import AdapterReact16 from 'enzyme-adapter-react-16';

import ConnectedApp from './App';

jest.mock('common/pp-ga/ga', () => null);
jest.mock('common/chrome-storage', () => null);

const mockTabId = 1;
jest.mock('common/store/tabs/tab-utils', () => ({
  __esModule: true,
  initializeTabId: () => null,
  getTabId: () => mockTabId,
}));

Enzyme.configure({ adapter: new AdapterReact16() });
const middlewares = [];
const mockStore = configureStore(middlewares);

const correctStoreState = {
  tabs: {
    [mockTabId]: {
      tabInfo: {
        currentUrl: 'www.xyz.com',
      },
      widgets: {
        menu: {
          visible: false,
        },
        editor: {
          visible: false,
        },
        annotationRequestForm: {
          visible: false,
        },
        annotationForm: {
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
    },
  },
};

describe('App component', () => {
  it('shallow renders without crashing', () => {
    const initialState = { ...correctStoreState };
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
    const initialState = { ...correctStoreState };

    const store = mockStore(initialState);

    Enzyme.mount(
      <ConnectedApp/>,
      { context: { store } },
    );

  });
});
