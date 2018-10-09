import { MODIFY_APP_MODES } from './actions';
import { AppModes } from './types';

const initialState: AppModes = {
  isExtensionDisabled: false,
  annotationModePages: [],
  disabledPages: [],
};

export default function appModes(state = initialState, action) {
  switch (action.type) {
    case MODIFY_APP_MODES:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
