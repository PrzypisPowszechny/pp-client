import { Range as XPathRange } from 'xpath-range';

export interface AnnotationsState {
  hasLoaded: boolean;
  located: LocatedAnnotation[];
  unlocated: LocatedAnnotation[];
}

export interface LocatedAnnotation {
  annotationId: string;
  range: XPathRange.SerializedRange;
}
