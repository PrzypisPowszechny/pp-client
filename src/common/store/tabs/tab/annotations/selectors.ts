import { selectAnnotation } from '../api/selectors';
import { ITabState } from '../reducer';
import { PopupAnnotationLocationData } from '../../../../../popup/messages';
import { selectTab } from 'common/store/tabs/selectors';

export function selectAnnotationLocationForBrowserStorage(state: ITabState): PopupAnnotationLocationData {
  const { located, unlocated, hasLoaded } = selectTab(state).annotations;
  // Save annotation location data for usage in popup
  return {
    hasLoaded,
    located: located.map(annotation => selectAnnotation(state, annotation.annotationId)),
    unlocated: unlocated.map(annotationId => selectAnnotation(state, annotationId)),
  };
}
