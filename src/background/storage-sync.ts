import { Store } from 'redux';
import { REDUX_STORAGE } from 'common/chrome-storage/keys';
import _ from 'lodash';

export const HYDRATE_FROM_CHROME_STORAGE = 'HYDRATE_FROM_CHROME_STORAGE';
export const SET_STATE_HYDRATED = 'SET_STATE_HYDRATED';

export interface IStorageSyncState<T> {
  isHydrated: boolean;
  value: T;
}

export default class StorageSync {
  static getReducer(originalReducer: (state, action) => any) {
    const initialState = {
      isHydrated: false,
      value: originalReducer(undefined, {}),
    };

    return (state: any = initialState, action) => {
      switch (action.type) {
        case SET_STATE_HYDRATED:
          return {
            isHydrated: true,
            value: state.value,
          };
        case HYDRATE_FROM_CHROME_STORAGE:
          return {
            isHydrated: true,
            value: action.payload,
          };
        default:
          return {
            isHydrated: state.isHydrated || false,
            value: originalReducer(state.value, action),
          };
      }
    };
  }

  protected static defaultKey: string = REDUX_STORAGE;

  protected key: string;
  protected store: Store<any>;
  protected storage: chrome.storage.StorageArea;
  protected selectStorage: (state) => any;

  protected lastState: any;

  protected isHydrating: boolean;
  protected unsubscribe: () => void;

  constructor(
    store: Store<any>,
    selectStorage: (state) => any,
    storage: chrome.storage.StorageArea,
  ) {
    this.store = store;
    this.storage = storage;
    this.selectStorage = selectStorage;
    this.key = StorageSync.defaultKey;
    this.lastState = store.getState().storage;
    this.isHydrating = false;
  }

  async init() {
    this.unsubscribe = this.store.subscribe(this.onStoreChange);
    return this.hydrateFromStorage();
  }

  async hydrateFromStorage() {
    const items = await new Promise(resolve => this.storage.get([this.key], resolve));
    const state = items[this.key];
    this.isHydrating = true;
    try {
      // await in case dispatch returns promise as in webext-redux
      if (state !== undefined) {
        await this.store.dispatch({ type: HYDRATE_FROM_CHROME_STORAGE, payload: state });
      } else {
        await this.store.dispatch({ type: SET_STATE_HYDRATED });
      }
    } catch (e) {
      throw new Error(`Error hydrating store from chrome storage: ${e.toString()}`);
    } finally {
      this.isHydrating = false;
    }
    const newState = this.selectStorage(this.store.getState()).value;
    this.lastState = newState;
    return newState;
  }

  onStoreChange = () => {
    const storageState = this.selectStorage(this.store.getState()).value;
    if (!_.isEqual(this.lastState, storageState) && !this.isHydrating) {
      this.lastState = storageState;
      this.storage.set({ [this.key]: storageState });
    }
  }

  destroy() {
    this.unsubscribe();
  }
}
