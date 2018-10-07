import { Range as XPathRange } from 'xpath-range';

export interface AnnotationsState {
  located: LocatedAnnotation[];
  unlocated: string[];
}

export interface LocatedAnnotation {
  annotationId: string;
  range: XPathRange.SerializedRange;
}
