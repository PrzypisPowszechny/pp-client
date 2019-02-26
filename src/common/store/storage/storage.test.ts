import * as chromeKeys from 'common/chrome-storage/keys';
import { userLoggedIn } from './actions';
import StorageSync from 'background/storage-sync';
import { combineReducers, createStore } from 'redux';
import storage from './reducers';

const credentials = {
  userId: 'dummy',
  access: 'dummy',
  refresh: 'dummy',
};

const reducer = combineReducers({
  storage,
});

let store;
/*
 *
 */
describe('storage reducer sync', () => {

  beforeEach(() => {
    // @ts-ignore
    chrome.storage.local.set.mockClear();
  });

  it('dispatch on store calls storage', async () => {
    const initialState = {
      storage: {},
    };
    store = createStore(
      reducer,
      initialState,
    );
    new StorageSync(store, chrome.storage.local).init();
    store.dispatch(userLoggedIn(credentials));

    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      [chromeKeys.REDUX_STORAGE]: { auth: credentials },
    });
  });

  it('dispatch only calls storage on change', async () => {
    const initialState = {
      storage: { auth: credentials },
    };
    store = createStore(
      reducer,
      initialState,
    );
    new StorageSync(store, chrome.storage.local).init();
    store.dispatch(userLoggedIn(credentials));

    expect(chrome.storage.local.set).toHaveBeenCalledTimes(0);
  });
});
