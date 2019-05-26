import { Range as XPathRange } from 'xpath-range';

export enum AnnotationRequestsStage {
  unloaded = 'unloaded',
  loaded = 'loaded',
  located = 'located',
}

export interface AnnotationRequestsState {
  stage: AnnotationRequestsStage;
  located: LocatedAnnotationRequest[];
  unlocated: LocatedAnnotationRequest[];
}

export interface LocatedAnnotationRequest {
  annotationId: string;
  range: XPathRange.SerializedRange;
}
