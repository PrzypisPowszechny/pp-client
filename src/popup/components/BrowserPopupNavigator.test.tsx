import React from 'react';
import Enzyme from 'enzyme';
import AdapterReact16 from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import BrowserPopupNavigator from './BrowserPopupNavigator';
import { IState } from '../../common/store/reducer';

const mockTabId = 1;
jest.mock('common/tab-id', () => ({
  __esModule: true,
  initializeTabId: () => null,
  getTabId: () => mockTabId,
}));

Enzyme.configure({ adapter: new AdapterReact16() });
const middlewares = [];
const mockStore = configureStore(middlewares);

describe('BrowserPopupNavigator component', () => {

  it('does not crash when storage and tab not initialized', () => {
    const initialState = {
      tabs: {},
      storage: {
        isHydrated: false,
        value: {},
      },
    };
    const store = mockStore(initialState);
    const wrapper = Enzyme.shallow(
      <BrowserPopupNavigator/>,
      { context: { store } },
    );
    expect(wrapper.find('BrowserPopupNavigator').length).toBeTruthy();
  });

  it('does not crash when only tab initialized', () => {
    const initialState = {
      tabs: {
        [mockTabId]: {},
      },
      storage: {
        isHydrated: false,
        value: {},
      },
    };
    const store = mockStore(initialState);
    const wrapper = Enzyme.shallow(
      <BrowserPopupNavigator/>,
      { context: { store } },
    );
    expect(wrapper.find('BrowserPopupNavigator').length).toBeTruthy();
  });

  it('does not crash when tab and storage initialized', () => {
    const initialState = {
      tabs: {
        [mockTabId]: {},
      },
      storage: {
        isHydrated: true,
        value: {
          auth: {},
        },
      },
    };
    const store = mockStore(initialState);
    const wrapper = Enzyme.shallow(
      <BrowserPopupNavigator/>,
      { context: { store } },
    );
    expect(wrapper.find('BrowserPopupNavigator').length).toBeTruthy();
  });

  it('does not crash when user logged in', () => {
    const initialState = {
      tabs: {
        [mockTabId]: {},
      },
      storage: {
        isHydrated: true,
        value: {
          auth: {
            userId: 'user',
            access: '1234',
            refresh: '5678',
          },
        },
      },
    };
    const store = mockStore(initialState);
    const wrapper = Enzyme.shallow(
      <BrowserPopupNavigator/>,
      { context: { store } },
    );
    expect(wrapper.find('BrowserPopupNavigator').length).toBeTruthy();
  });

});
