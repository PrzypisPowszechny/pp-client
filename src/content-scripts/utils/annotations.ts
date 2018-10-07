import rangy from 'rangy';
import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-highlighter';
import 'rangy/lib/rangy-textrange';
import 'rangy/lib/rangy-serializer';

import { Range as XPathRange } from 'xpath-range';
import { PPHighlightClass } from 'content-scripts/class_consts';
import { annotationRootNode } from '../core';

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
