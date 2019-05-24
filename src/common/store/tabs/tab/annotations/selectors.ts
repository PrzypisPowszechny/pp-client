import { selectTab } from 'common/store/tabs/selectors';

import { AnnotationsStage } from './types';

import { AnnotationAPIModel } from '../../../../api/annotations';
import { selectAnnotation } from '../api/selectors';
import { ITabState } from '../reducer';

export interface PopupAnnotationLocationData {
  stage: AnnotationsStage;
  located: AnnotationAPIModel[];
  unlocated: AnnotationAPIModel[];
}

export function selectAnnotationLocations(state: ITabState): PopupAnnotationLocationData {
  const { located, unlocated, stage } = selectTab(state).annotations;
  // Save annotation location data for usage in popup
  return {
    stage,
    located: located.map(location => selectAnnotation(state, location.annotationId)),
    unlocated: unlocated.map(location => selectAnnotation(state, location.annotationId)),
  };
}
