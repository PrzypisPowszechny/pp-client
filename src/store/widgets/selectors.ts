import { createSelector } from 'reselect';
import { IStore } from 'store/reducer';

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

function selectAnnotationForm(annotations, editor) {
  const annotationId = editor.annotationId;
  // When the annotation is being created for the first time, range is stored in state.editor.range;
  // If the annotation already exists, it is taken from annotation API model.
  let range;
  let annotation;
  if (annotationId) {
    annotation = annotations.find(x => x.id === annotationId);
    range = annotation.attributes.range;
  } else {
    annotation = null;
    range = editor.range;
  }

  return {
    annotation,
    range,
  };
}

export const selectEditorState = createSelector<IStore, any, any, any>(
  state => state.widgets.editor,
  state => state.api.annotations ? state.api.annotations.data : [],
  (editor, annotations) => ({
    ...selectWidgetState(editor),
    ...selectAnnotationForm(annotations, editor),
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
