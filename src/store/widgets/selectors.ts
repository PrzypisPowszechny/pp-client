import { createSelector } from 'reselect';
import { ITabState } from 'store/reducer';
import { AnnotationAPIModel, AnnotationProvider, AnnotationViewModel } from '../../api/annotations';
import { DemagogAnnotationAPIModel } from '../../api/demagog-annotations';

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

function mapToAnnotationViewModel(instance: AnnotationAPIModel) {
  return {
    id: instance.id,
    ...instance.attributes,
    provider: AnnotationProvider.USER,
    demagogCategory: null,
  };
}

export function selectAnnotation(state: ITabState, prefixedAnnotationId: string): AnnotationViewModel {
  if (!prefixedAnnotationId) {
    return;
  }
  const splitId = prefixedAnnotationId.split('.');
  if (splitId.length === 1) {
    const annotation = state.api.annotations.data.find( instance => instance.id === splitId[0]);
    return mapToAnnotationViewModel(annotation);
  } else if (splitId.length === 2 && splitId[0] === 'demagog') {
    // search
    return state.demagogApi.annotations.find(instance => instance.id === prefixedAnnotationId);
  } else {
    throw Error(`Unrecognised AnnotationViewModel id: "${prefixedAnnotationId}"`);
  }
}

export const selectAnnotations = createSelector<
  ITabState,
  AnnotationViewModel[],
  AnnotationAPIModel[],
  AnnotationViewModel[]>(
  state => state.demagogApi.annotations,
  state => state.api.annotations.data,
  (demagogAnnotations, annotations) => {
    // Demagog annotations mapping to view model involves major logic so it's done at the loading time;
    // user annotations have not been mapped yet
    const userAnnotations: AnnotationViewModel[] = annotations.map(mapToAnnotationViewModel);
    return demagogAnnotations.concat(userAnnotations);
  },
);

export const selectEditorState = createSelector<ITabState, any, any, any>(
  state => state.widgets.editor,
  state => state.api.annotations.data,
  (editor, annotations) => ({
    ...selectWidgetState(editor),
    ...selectAnnotationForm(annotations, editor),
  }),
);

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
