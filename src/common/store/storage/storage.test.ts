import * as chromeKeys from 'common/chrome-storage/keys';
import { userLoggedIn } from './actions';
import StorageSync from 'background/storage-sync';
import { combineReducers, createStore } from 'redux';

/*
 *
 */
describe('storage reducer sync', () => {

  beforeEach(() => {
    // @ts-ignore
    chrome.storage.local.set.mockClear();
  });

  it('storage sync reducer works like the original reducer', async () => {
    const originalReducer = (state = {}, action) => {
      return { ...state, ...action.payload };
    };
    const reducer = StorageSync.getReducer(originalReducer);
    const changeAction = { type: 'CHANGE_STORE_ACTION', payload: 'dummy' };
    expect(originalReducer(undefined, changeAction)).toEqual(reducer(undefined, changeAction));
    expect(originalReducer({}, changeAction)).toEqual(reducer({}, changeAction));
  });

  it('dispatch on store calls storage', async () => {
    const originalReducer = (state, action) => {
      return { ...state, ...action };
    };
    const rootReducer = combineReducers({
      storage: StorageSync.getReducer(originalReducer),
    });
    const store = createStore(
      rootReducer,
    );
    new StorageSync(store, state => state.storage, chrome.storage.local).init();

    const changeAction = { type: 'CHANGE_STORE_ACTION', payload: 'dummy' };
    store.dispatch(changeAction);

    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      [chromeKeys.REDUX_STORAGE]: changeAction,
    });
  });

  it('dispatch only calls storage on change', async () => {
    const originalReducer = (state, action) => {
      return { ...state, ...action };
    };
    const rootReducer = combineReducers({
      storage: StorageSync.getReducer(originalReducer),
    });
    const store = createStore(
      rootReducer,
    );
    new StorageSync(store, state => state.storage, chrome.storage.local).init();

    const changeAction = { type: 'CHANGE_STORE_ACTION', payload: 'dummy' };
    store.dispatch(changeAction);
    store.dispatch(changeAction);

    expect(chrome.storage.local.set).toHaveBeenCalledTimes(1);
  });
});
