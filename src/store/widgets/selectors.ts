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

export const selectEditorState = createSelector<IStore, any, any>(
  state => state.widgets.editor,
  selectWidgetState,
);
