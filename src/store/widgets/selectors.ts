import { createSelector } from 'reselect';
import { IStore } from 'store/reducer';
import {AnnotationPriorities} from '../../components/consts';
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
