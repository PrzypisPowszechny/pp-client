import { createSelector } from 'reselect';

import { selectTab } from 'common/store/tabs/selectors';

import { ITabState } from '../reducer';

function selectWidgetState({ location = { x: null, y: null }, visible }) {
  return {
    visible,
    locationX: location.x,
    locationY: location.y,
  };
}

export const selectMenuState = createSelector<ITabState, any, any, any>(
  state => selectTab(state).widgets.menu,
    state => selectTab(state).textSelector,
  (menu, textSelector) => ({
    ...selectWidgetState(menu),
    annotationLocation: { ...textSelector },
  }),
);

function selectAnnotationForm(annotations, editor) {
  const annotationId = editor.annotationId;
  // When the annotation is being created for the first time, annotation location is stored in
  // state.editor.annotationLocation;
  // If the annotation already exists, it is taken from annotation API model.
  let annotation;
  let annotationLocation;
  if (annotationId) {
    annotation = annotations.find(x => x.id === annotationId);
    annotationLocation = {
      range: annotation.attributes.range,
      quote: annotation.attributes.quote,
      quoteContext: annotation.attributes.quoteContext,
    };
  } else {
    annotation = null;
    annotationLocation = { ...editor.annotationLocation };
  }

  return {
    annotation,
    annotationLocation,
  };
}

export const selectEditorState = createSelector<ITabState, any, any, any>(
  state => selectTab(state).widgets.editor,
  state => selectTab(state).api.annotations.data,
  (editor, annotations) => ({
    ...selectWidgetState(editor),
    ...selectAnnotationForm(annotations, editor),
  }),
);

export const selectViewerState = createSelector<ITabState, any, any>(
  state => selectTab(state).widgets.viewer,
  viewer => ({
    ...selectWidgetState(viewer),
    annotationIds: viewer.viewerItems.map(annotation => annotation.annotationId),
    isAnyReportEditorOpen: viewer.viewerItems.some(item => item.isReportEditorOpen),
    deleteModal: viewer.deleteModal,
    mouseOver: viewer.mouseOver,
  }),
);
