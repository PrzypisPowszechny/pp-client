import { Store } from 'redux';
import { REDUX_STORAGE } from '../common/chrome-storage/keys';
import _ from 'lodash';

export default class StorageSync {
  protected static defaultKey: string = REDUX_STORAGE;

  protected key: string;
  protected store: Store<any>;
  protected storage: chrome.storage.StorageArea;
  protected lastState: any;

  protected unsubscribe: () => void;

  constructor(store: Store<any>, storage: chrome.storage.StorageArea) {
    this.store = store;
    this.storage = storage;
    this.key = StorageSync.defaultKey;
    this.lastState = store.getState().storage;
  }

  init() {
    this.unsubscribe = this.store.subscribe(() => {
      const storageState = this.store.getState().storage;
      if (!_.isEqual(this.lastState, storageState)) {
        this.lastState = storageState;
        this.storage.set({ [this.key]: storageState });
      }
    });
  }

  destroy() {
    this.unsubscribe();
  }
}
