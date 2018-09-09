import { DEMAGOG_ANNOTATIONS_LOADED } from './actions';

const initialState = {
  annotations: [],
};

export default function demagogApi(state = initialState, action) {
  switch (action.type) {
    case DEMAGOG_ANNOTATIONS_LOADED:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
