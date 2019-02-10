import { UPDATE_TAB_INFO } from './actions';
import { combineReducers } from 'redux';

export interface ITabState {
  currentUrl: string;
}

const initialState = {
  currentUrl: '',
};

function tabInfo(state = initialState, action) {
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

export default combineReducers({
  tabInfo,
});
