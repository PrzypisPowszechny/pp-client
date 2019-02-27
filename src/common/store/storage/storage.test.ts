import * as chromeKeys from 'common/chrome-storage/keys';
import StorageSync from 'background/storage-sync';
import { combineReducers, createStore } from 'redux';

const originalReducer = (state: any = { key: 'initial' }, action) => {
  return { ...action.payload };
};
const reducer = StorageSync.getReducer(originalReducer);
const rootReducer = combineReducers({
  storage: StorageSync.getReducer(originalReducer),
});
let store;
let storageSync;
/*
 *
 */
describe('storage reducer sync', () => {

  beforeEach(() => {
    chrome.storage.local.clear();
    // @ts-ignore
    chrome.storage.local.get.mockClear();
    // @ts-ignore
    chrome.storage.local.set.mockClear();
    // recreate the store
    store = createStore(
      rootReducer,
    );
    storageSync = new StorageSync(store, state => state.storage, chrome.storage.local);
  });

  it('storage sync reducer wraps the original reducer', async () => {
    const changeAction = { type: 'CHANGE_STORE_ACTION', payload: { key: 'dummy' } };
    expect(originalReducer(undefined, changeAction)).toEqual(reducer(undefined, changeAction).value);
    expect(originalReducer({}, changeAction)).toEqual(reducer({}, changeAction).value);
    expect(reducer(undefined, {}).isHydrated).toEqual(false);
  });

  it('isHydrated set true when hydrated', async () => {
    // @ts-ignore
    expect(store.getState().storage.isHydrated).toEqual(false);

    await storageSync.init();
    // @ts-ignore
    expect(store.getState().storage.isHydrated).toEqual(true);
  });

  it('when chrome storage empty, isHydrated set to true with reducer default state as value', async () => {
    await storageSync.init();
    // @ts-ignore
    expect(store.getState().storage).toEqual({
      isHydrated: true,
      value: originalReducer(undefined, {}),
    });
  });

  it('init calls the storage', async () => {
    await storageSync.init();
    // not possible to check with toHaveBeenCalledWith because of callback unequality
    expect(chrome.storage.local.get).toHaveBeenCalled();
  });

  it('dispatch on store calls storage', async () => {
    await storageSync.init();
    const payload = { key: 'changed' };
    const changeAction = { type: 'CHANGE_STORE_ACTION', payload };

    store.dispatch(changeAction);
    expect(chrome.storage.local.set).toHaveBeenCalledTimes(1);
    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      [chromeKeys.REDUX_STORAGE]: payload,
    });
  });

  it('dispatch only calls storage on change', async () => {
    await storageSync.init();
    const payload = { key: 'changed' };
    const changeAction = { type: 'CHANGE_STORE_ACTION', payload };
    store.dispatch(changeAction);
    store.dispatch(changeAction);
    expect(chrome.storage.local.set).toHaveBeenCalledTimes(1);
  });

  it('when chrome storage set, hydrate with its value', async () => {
    const originalGet = chrome.storage.local.get;
    const presetChromeStorageState = { presetKey: 'presetValue' };
    await  new Promise(resolve => chrome.storage.local.set(
      { [chromeKeys.REDUX_STORAGE]: presetChromeStorageState }, resolve),
    );

    await storageSync.init();
    // @ts-ignore
    expect(store.getState().storage).toEqual({
      isHydrated: true,
      value: presetChromeStorageState,
    });

    chrome.storage.local.get = originalGet;
  });
});
