import { AppModes } from './types';

export const MODIFY_APP_MODES = 'MODIFY_APP_MODES';

export function changeAppModes(appModes: AppModes) {
  return {
    type: MODIFY_APP_MODES,
    payload: {
      ...appModes,
    },
  };
}
