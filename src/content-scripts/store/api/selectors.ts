import { ITabState } from '../reducer';

export function selectAnnotations(state: ITabState) {
  return state.api.annotations.data;
}

export function selectAnnotation(state: ITabState, annotationId: string) {
  return state.api.annotations.data.find( annotation => annotation.id === annotationId);
}

export function selectUpvote(state: ITabState, upvoteId: string) {
  return state.api.annotationUpvotes.data.find(upvote => upvote.id === upvoteId);
}
