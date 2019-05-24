import { selectTab } from 'common/store/tabs/selectors';

import { ITabState } from '../reducer';
import { AnnotationRequestAPIModel } from '../../../../api/annotation-requests';
import { selectAnnotationRequest } from '../api/selectors';
import { AnnotationRequestsStage } from './types';

export interface PopupAnnotationRequestLocationData {
  stage: AnnotationRequestsStage;
  located: AnnotationRequestAPIModel[];
  unlocated: AnnotationRequestAPIModel[];
}

export function selectAnnotationRequestLocations(state: ITabState): PopupAnnotationRequestLocationData {
  const { located, unlocated, stage } = selectTab(state).annotationRequests;
  // Save annotation location data for usage in popup
  return {
    stage,
    located: located.map(location => selectAnnotationRequest(state, location.annotationId)),
    unlocated: unlocated.map(location => selectAnnotationRequest(state, location.annotationId)),
  };
}
