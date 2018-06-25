import { MODIFY_APP_MODES } from './actions';

export interface AppModeReducer {
  isExtensionDisabled: boolean;
  annotationModePages: string[];
  disabledPages: string[];
}

const initialState: AppModeReducer = {
  isExtensionDisabled: false,
  annotationModePages: [],
  disabledPages: [],
};

export default function appModes(state = initialState, action) {
  switch (action.type) {
    case MODIFY_APP_MODES:
      return appModesActionHandler(state, action.payload);
    default:
      return state;
  }
}

function appModesActionHandler(state, payload) {
  return {
    ...state,
    ...payload,
  };
}
