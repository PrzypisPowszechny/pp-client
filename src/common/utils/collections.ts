import _difference from 'lodash/difference';

export function setsEqual(first: any[], second: any[]) {
  return _difference(first, second).length === 0 || _difference(second, first).length === 0;
}
