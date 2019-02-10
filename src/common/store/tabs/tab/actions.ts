
export const UPDATE_TAB_INFO = 'UPDATE_TAB_INFO';

export function updateTabInfo(tabInfo) {
  return {
    type: UPDATE_TAB_INFO,
    payload: {
      ...tabInfo,
    },
  };
}
