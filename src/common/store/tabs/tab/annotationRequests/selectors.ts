import { selectAnnotation } from '../api/selectors';
import { ITabState } from '../reducer';
import { selectTab } from 'common/store/tabs/selectors';
import { AnnotationAPIModel } from '../../../../api/annotations';

export interface PopupAnnotationLocationData {
  hasLoaded: boolean;
  located: AnnotationAPIModel[];
  unlocated: AnnotationAPIModel[];
}

export function selectAnnotationLocations(state: ITabState): PopupAnnotationLocationData {
  const { located, unlocated, hasLoaded } = selectTab(state).annotations;
  // Save annotation location data for usage in popup
  return {
    hasLoaded,
    located: located.map(location => selectAnnotation(state, location.annotationId)),
    unlocated: unlocated.map(location => selectAnnotation(state, location.annotationId)),
  };
}
