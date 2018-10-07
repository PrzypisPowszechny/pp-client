import rangy from 'rangy';
import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-highlighter';
import 'rangy/lib/rangy-textrange';
import 'rangy/lib/rangy-serializer';
import { Range as XPathRange } from 'xpath-range';
import { escapeRegExp } from 'tslint/lib/utils';
import { PPHighlightClass } from 'content-scripts/class_consts';
import { annotationRootNode } from '../core';

export function findUniqueTextInDOMAsRange(quote: string): XPathRange.SerializedRange {
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
  const searchRegexp = escapeRegExp(quote.trim()).replace(/\s/, '\\s+');

  // Assume there is only one text like this on the page and return the first one
  if (range.findText(new RegExp(searchRegexp), options)) {
    return new XPathRange.BrowserRange(range).normalize().limit(annotationRootNode()).serialize(annotationRootNode());
  } else {
    return null;
  }
}

export function XPathNormalizedRangeToRangyRange(xPathRange: XPathRange.NormalizedRange) {
  const rangyRange = rangy.createRange();
  const textNodes = xPathRange.textNodes();
  rangyRange.setStartBefore(textNodes[0]);
  rangyRange.setEndAfter(textNodes[textNodes.length - 1]);
  return rangyRange;
}

export interface AnnotationLocation {
  range: XPathRange.SerializedRange;
  quote: string;
  quoteContext: string;
}

export function fullAnnotationLocation(normalizedRange: XPathRange.NormalizedRange): AnnotationLocation {
  const contextWidth = 100;
  // rangy.getSelection().setSingleRange(x);
  const rangyRange = XPathNormalizedRangeToRangyRange(normalizedRange);
  const quote = rangyRange.text();
  rangyRange.moveStart('character', -contextWidth);
  rangyRange.moveEnd('character', contextWidth);
  const quoteContext = rangyRange.text();
  return {
      range: normalizedRange.serialize(annotationRootNode(), `.${PPHighlightClass}`),
      quote,
      quoteContext,
  };
}
