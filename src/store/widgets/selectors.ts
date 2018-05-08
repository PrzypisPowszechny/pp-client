import { createSelector } from 'reselect';
import { IStore } from 'store/reducer';
import {AnnotationPriorities} from 'components/consts';
import {IWidgetState, WidgetReducer} from './reducers';

function selectWidgetState({ location, visible }) {
  return {
    visible,
    locationX: location.x,
    locationY: location.y,
  };
}

export const selectMenuState = createSelector<IStore, any, any>(
  state => state.widgets.menu,
  selectWidgetState,
);

function selectAnnotationForm(annotations, annotationId?) {
  let attrs;
  if (annotationId) {
    const model = annotations.find(x => x.id === annotationId);
    attrs = model.attributes;
  } else {
    attrs = {};
  }

  return {
    annotationId,
    priority: attrs.priority || AnnotationPriorities.NORMAL,
    comment: attrs.comment || '',
    annotationLink: attrs.annotationLink || '',
    annotationLinkTitle: attrs.annotationLinkTitle || '',
  };
}

export const selectEditorState = createSelector<IStore, any, any, any>(
  state => state.widgets.editor,
  state => state.api.annotations ? state.api.annotations.data : [],
  (editor, annotations) => ({
    ...selectWidgetState(editor),
    ...selectAnnotationForm(annotations, editor.annotationId),
    range: editor.range,
  }),
);

function selectViewerAnnotations(annotations: any[], annotationIds: any[]) {
  return annotationIds.map(id => annotations.find(annotation => annotation.id === id));
}

export const selectViewerState = createSelector<IStore, any, any, any>(
  state => state.widgets.viewer,
  state => state.api.annotations ? state.api.annotations.data : [],
  (viewer, annotations) => ({
    ...selectWidgetState(viewer),
    annotations: selectViewerAnnotations(annotations, viewer.annotationIds),
  }),
);
