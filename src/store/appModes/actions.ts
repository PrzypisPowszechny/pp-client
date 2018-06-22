export const MODIFY_APP_MODES = 'MODIFY_APP_MODES';

export function changeAppModes(settings) {
  return {
    type: MODIFY_APP_MODES,
    payload: {
      settings,
    },
  };
}
