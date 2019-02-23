import { UPDATE_TAB_INFO } from './actions';

const initialState = {
  currentUrl: '',
};

export interface ITabInfoState {
  currentUrl: string;
}

export function tabInfo(state = initialState, action) {
  switch (action.type) {
    case UPDATE_TAB_INFO:
      console.log('tab info updated');
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
