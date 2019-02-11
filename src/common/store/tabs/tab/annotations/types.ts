import { Range as XPathRange } from 'xpath-range';

export interface AnnotationsState {
  hasLoaded: boolean;
  located: LocatedAnnotation[];
  unlocated: string[];
}

export interface LocatedAnnotation {
  annotationId: string;
  range: XPathRange.SerializedRange;
}
