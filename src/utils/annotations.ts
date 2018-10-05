import rangy from 'rangy';
import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-highlighter';
import 'rangy/lib/rangy-textrange';
import 'rangy/lib/rangy-serializer';
import { Range } from 'xpath-range';
import { escapeRegExp } from 'tslint/lib/utils';
import { PPHighlightClass } from '../class_consts';
import { annotationRootNode } from '../core';

export function uniqueTextToXPathRange(text: string, element: Node): Range.SerializedRange {
  const searchScopeRange = rangy.createRange();
  searchScopeRange.selectNodeContents(document.body);
  const options = {
    caseSensitive: false,
    wholeWordsOnly: false,
    withinRange: searchScopeRange,
    direction: 'forward',
  };
  const range = rangy.createRange();
  // 1. Escape the characters (e.g. '.', '(', ')') having special meaning in regex
  // 2. Replace spaces with \s+ for more robustness
  // todo consider removing some other characters not essential to the sentence content
  const searchRegexp = escapeRegExp(text.trim()).replace(/\s/, '\\s+');

  // Assume there is only one text like this on the page and return the first one
  if (range.findText(new RegExp(searchRegexp), options)) {
    const browserRange = new Range.BrowserRange(range);
    const normedRange = browserRange.normalize().limit(document.body);
    return normedRange.serialize(element);
  } else {
    return null;
  }
}

export interface AnnotationLocation {
  range: Range.SerializedRange;
  text: string;
}

export function fullAnnotationLocation(range: Range.NormalizedRange): AnnotationLocation {
  const serializedRanges = [];
  return {
      range: range.serialize(annotationRootNode(), `.${PPHighlightClass}`),
      text: range.text(),
  };
}
