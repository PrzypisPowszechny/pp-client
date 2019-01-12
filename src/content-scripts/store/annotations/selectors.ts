import { selectAnnotation } from '../api/selectors';
import { ITabState } from '../reducer';
import { PopupAnnotationLocationData } from '../../../popup/messages';

export function selectAnnotationLocationForBrowserStorage(state: ITabState): PopupAnnotationLocationData {
  const { located, unlocated, hasLoaded } = state.annotations;
  // Save annotation location data for usage in popup
  return {
    hasLoaded,
    located: located.map(annotation => selectAnnotation(state, annotation.annotationId)),
    unlocated: unlocated.map(annotationId => selectAnnotation(state, annotationId)),
  };
}
