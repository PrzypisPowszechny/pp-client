import { Store } from 'redux';
import { REDUX_STORAGE } from '../common/chrome-storage/keys';
import _ from 'lodash';

export const HYDRATE_FROM_CHROME_STORAGE = 'HYDRATE_FROM_CHROME_STORAGE';

export default class StorageSync {
  protected static defaultKey: string = REDUX_STORAGE;

  protected key: string;
  protected store: Store<any>;
  protected storage: chrome.storage.StorageArea;
  protected selectStorage: (state) => any;

  protected lastState: any;

  protected unsubscribe: () => void;

  static getReducer(reducer: (state, action) => any) {
    return (state, action) => {
      switch (action.type) {
        case HYDRATE_FROM_CHROME_STORAGE:
          return { ...action.payload };
        default:
          return reducer(state, action);
      }
    };
  }

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
  }

  init() {
    this.unsubscribe = this.store.subscribe(() => {
      const storageState = this.selectStorage(this.store.getState());
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
