import {CREATE_ANNOTATION} from './actions';

const initialState = {
  data: [],
};

function maxId(state) {
  return Math.max(0, ...state.data.map(annotation => annotation.annotationId)) + 1;
}

export default function annotations(state = initialState, action) {
  switch (action.type) {
    case CREATE_ANNOTATION:
      return Object.assign({}, {
        ...state,
        data: state.data.concat([{
          ...action.payload,
          annotationId: maxId(state),
        }]),
      });
    default:
      return state;
  }
}
