
// Special action called to initialize the tab before any other tab-related actions
export const TAB_INIT = 'TAB_INIT';
export const TAB_POPUP_INIT = 'TAB_POPUP_INIT';

export function tabInit() {
  return { type: TAB_INIT };
}

export function tabPopupInit() {
  return { type: TAB_POPUP_INIT };
}
