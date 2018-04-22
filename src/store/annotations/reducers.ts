import {CREATE_ANNOTATION} from './actions';

const initialState = {
  data: [],
};

export default function editor(state = initialState, action) {
  switch (action.type) {
    case CREATE_ANNOTATION:
      return Object.assign({}, {
        data: state.data.concat([action.payload]),
      });
    default:
      return state;
  }
}
