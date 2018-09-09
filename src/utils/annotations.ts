import rangy from 'rangy';
import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-highlighter';
import 'rangy/lib/rangy-textrange';
import 'rangy/lib/rangy-serializer';

import { Range } from 'xpath-range';

export function uniqueTextToXPathRange(text: string, element: Node): Range.SerializedRange {
  // TODO support UTF-8 characters
  // todo is it robust enough? what about punctuation / multiple spaces in the original text?
  const searchScopeRange = rangy.createRange();
  searchScopeRange.selectNodeContents(document.body);
  const options = {
                  caseSensitive: false,
                  wholeWordsOnly: false,
                  withinRange: searchScopeRange,
                  direction: 'forward',
                };
  const range = rangy.createRange();

  // Assume there is only one text like this on the page and return the first one
  const searchRegexp = text.trim().replace(/\s/, '\\s+');
  // Replace spaces with \s+ so they match any number of whitespace characters that could break the search
  if (range.findText(new RegExp(searchRegexp), options)) {
    const browserRange = new Range.BrowserRange(range);
    const normedRange = browserRange.normalize().limit(document.body);
    return normedRange.serialize(element);
  } else {
    return null;
  }
}
