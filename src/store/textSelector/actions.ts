import { Range } from 'xpath-range';
import { SerializedRangeWithText } from '../../utils/annotations';

export const TEXT_SELECTED = 'TEXT_SELECTED';

export function makeSelection(rangeWithText?: SerializedRangeWithText) {
  return {
    type: TEXT_SELECTED,
    payload: rangeWithText ? {
      range: rangeWithText.range,
      text: rangeWithText.text,
    } : {
      range: null,
      text: '',
    },
  };
}
