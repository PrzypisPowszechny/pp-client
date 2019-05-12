import { ITabState } from '../reducer';
import { selectTab } from 'common/store/tabs/selectors';

export function selectAnnotations(state: ITabState) {
  return selectTab(state).api.annotations.data;
}

export function selectAnnotation(state: ITabState, annotationId: string) {
  return selectTab(state).api.annotations.data.find( annotation => annotation.id === annotationId);
}

export function selectAnnotationRequest(state: ITabState, annotationId: string) {
  return selectTab(state).api.annotationRequests.data.find( annotation => annotation.id === annotationId);
}

export function selectUpvote(state: ITabState, upvoteId: string) {
  return selectTab(state).api.annotationUpvotes.data.find(upvote => upvote.id === upvoteId);
}
