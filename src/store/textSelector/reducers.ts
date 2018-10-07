import { TEXT_SELECTED } from './actions';

const initialState = {
  range: null,
};

export default function textSelector(state = initialState, action) {
  switch (action.type) {
    case TEXT_SELECTED:
      return textSelectedActionHandler(state, action.payload);
    default:
      return state;
  }
}

function textSelectedActionHandler(state, payload) {
  return {
    ...state,
    ...payload,
  };
}
