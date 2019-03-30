
export const UPDATE_TAB_INFO = 'UPDATE_TAB_INFO';

export function updateTabInfo(currentUrl: string) {
  return {
    type: UPDATE_TAB_INFO,
    payload: {
      currentUrl,
    },
  };
}
