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

function selectAnnotationForm(annotations, annotationId?) {
  let model;
  if (annotationId) {
    model = annotations.find(x => x.id === annotationId);
  } else {
    model = {};
  }

  return {
    annotationId: model.id,
    priority: model.priority || AnnotationPriorities.NORMAL,
    comment: model.comment || '',
    referenceLink: model.referenceLink || '',
    referenceLinkTitle: model.referenceLinkTitle || '',
  };
}

function selectViewerAnnotations(annotations: any[], annotationIds: any[]) {
  return annotationIds.map(id => annotations.find(annotation => annotation.annotationId === id));
}

export const selectEditorState = createSelector<IStore, any, any, any>(
  state => state.widgets.editor,
  state => state.annotations.data,
  (editor, annotations) => ({
    ...selectWidgetState(editor),
    ...selectAnnotationForm(annotations, editor.annotationId),
    range: editor.range,
  }),
);

export const selectMenuState = createSelector<IStore, any, any>(
  state => state.widgets.menu,
  selectWidgetState,
);

export const selectViewerState = createSelector<IStore, any, any, any>(
  state => state.widgets.viewer,
  state => state.annotations.data,
  (viewer, annotations) => ({
    ...selectWidgetState(viewer),
    annotations: selectViewerAnnotations(annotations, viewer.annotationIds),
  }),
);
