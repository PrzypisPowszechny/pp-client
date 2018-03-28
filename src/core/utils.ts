/**
 * trim strips whitespace from either end of a string.
 *
 * This usually exists in native code, but not in IE8.
 */
export function trim(s: string) {
  if (typeof String.prototype.trim === 'function') {
    return String.prototype.trim.call(s);
  } else {
    return s.replace(/^[\s\xA0]+|[\s\xA0]+$/g, '');
  }
}

/**
 * rangesParser returns a function that can be used to construct an
 * annotation from a list of selected ranges.
 */
export function rangesParser(contextEl: Element, ignoreSelector: string) {
  return (ranges: JQuery.PlainObject) => {
    const text = [];
    const serializedRanges = [];

    for (let i = 0, len = ranges.length; i < len; i++) {
      const r = ranges[i];
      text.push(trim(r.text()));
      serializedRanges.push(r.serialize(contextEl, ignoreSelector));
    }

    return {
      quote: text.join(' / '),
      ranges: serializedRanges,
    };
  };
}
