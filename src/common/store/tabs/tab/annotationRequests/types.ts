import { Range as XPathRange } from 'xpath-range';

export interface AnnotationRequestsState {
  hasLoaded: boolean;
  located: LocatedAnnotationRequest[];
  unlocated: LocatedAnnotationRequest[];
}

export interface LocatedAnnotationRequest {
  annotationId: string;
  range: XPathRange.SerializedRange;
}
