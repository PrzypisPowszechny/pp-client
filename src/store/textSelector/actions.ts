import { Range } from 'xpath-range';

export const TEXT_SELECTED = 'TEXT_SELECTED';

export function makeSelection(range: Range.SerializedRange) {
  return {
    type: TEXT_SELECTED,
    payload: {
      range,
    },
  };
}

export function noSelection() {
  return {
    type: TEXT_SELECTED,
    payload: {
      range: null,
    },
  };
}
