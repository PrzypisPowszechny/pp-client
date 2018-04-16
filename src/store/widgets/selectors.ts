import { createSelector } from 'reselect';
import { IStore } from 'store/reducer';

function selectWidgetState({ inverted, location, visible }) {
  return {
    visible,
    invertedX: inverted.x,
    invertedY: inverted.y,
    locationX: location.x,
    locationY: location.y,
  };
}

export const selectMenuState = createSelector<IStore, any, any>(
  state => state.widgets.menu,
  selectWidgetState,
);

export const selectEditorState = createSelector<IStore, any, any>(
  state => state.widgets.editor,
  selectWidgetState,
);
