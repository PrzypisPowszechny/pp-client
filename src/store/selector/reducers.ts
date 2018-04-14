import { TEXT_SELECTED } from './actions';

const initialState = {};

export default function selector(state = initialState, action) {
  switch (action.type) {
    case TEXT_SELECTED:
      console.log('Handle text selected action, data: ', action.data);
      return textSelectedActionHandler(state, action.data);
    default:
      return state;
  }
}

function textSelectedActionHandler(state, data) {
  // TODO
  console.log('do sth with following data: ', data);

  return {
    ...state,
  };
}
