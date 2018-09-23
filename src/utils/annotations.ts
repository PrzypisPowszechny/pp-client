// import rangy from 'rangy/lib/rangy-core.js';
// import rangyHighlight from 'rangy/lib/rangy-highlighter';
// import rangyClassApplier from 'rangy/lib/rangy-classapplier';
// import rangyTextRange from 'rangy/lib/rangy-textrange';
// import rangySerializer from 'rangy/lib/rangy-serializer';
//
import rangy from 'rangy';
import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-highlighter';
import 'rangy/lib/rangy-textrange';
import 'rangy/lib/rangy-serializer';
import { Range } from 'xpath-range';
import { escapeRegExp } from 'tslint/lib/utils';

export function uniqueTextToXPathRange(text: string, element: Node): Range.SerializedRange {
  // TODO support UTF-8 characters
  // todo is it robust enough? what about punctuation / multiple spaces in the original text?
  console.log(rangy);
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
