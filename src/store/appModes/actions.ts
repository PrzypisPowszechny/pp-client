import { AppModeReducer } from './reducers';

export const MODIFY_APP_MODES = 'MODIFY_APP_MODES';

export function changeAppModes(appModes: AppModeReducer) {
  return {
    type: MODIFY_APP_MODES,
    payload: {
      ...appModes,
    },
  };
}
