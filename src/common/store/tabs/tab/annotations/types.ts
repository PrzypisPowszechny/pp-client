import { Range as XPathRange } from 'xpath-range';

export enum AnnotationsStage {
  unloaded = 'unloaded',
  loaded = 'loaded',
  located = 'located',
}

export interface AnnotationsState {
  stage: AnnotationsStage;
  located: LocatedAnnotation[];
  unlocated: LocatedAnnotation[];
}

export interface LocatedAnnotation {
  annotationId: string;
  range: XPathRange.SerializedRange;
}
