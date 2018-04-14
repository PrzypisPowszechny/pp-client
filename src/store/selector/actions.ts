export const TEXT_SELECTED = 'TEXT_SELECTED';
export function textSelectedAction(payload) {
  return {
    type: TEXT_SELECTED,
    payload,
  };
}
