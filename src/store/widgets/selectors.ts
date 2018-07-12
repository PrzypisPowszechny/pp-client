import { createSelector } from 'reselect';
import { ITabState } from 'store/reducer';

function selectWidgetState({ location, visible }) {
  return {
    visible,
    locationX: location.x,
    locationY: location.y,
  };
}

export const selectMenuState = createSelector<ITabState, any, any>(
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

export const selectEditorState = createSelector<ITabState, any, any, any>(
  state => state.widgets.editor,
  state => state.api.annotations.data,
  (editor, annotations) => ({
    ...selectWidgetState(editor),
    ...selectAnnotationForm(annotations, editor),
  }),
);

function selectViewerAnnotations(annotations: any[], annotationIds: any[]) {
  return annotationIds.map(id => annotations.find(annotation => annotation.id === id))
    // Filter out outdated annotationIds (which are only updated on view new opening)
    .filter( annotation => annotation);
}

export const selectViewerState = createSelector<ITabState, any, any>(
  state => state.widgets.viewer,
  viewer => ({
    ...selectWidgetState(viewer),
    annotationIds: viewer.viewerItems.map(annotation => annotation.annotationId),
    isAnyReportEditorOpen: viewer.viewerItems.some(item => item.isReportEditorOpen),
    deleteModal: viewer.deleteModal,
    mouseOver: viewer.mouseOver,
  }),
);
