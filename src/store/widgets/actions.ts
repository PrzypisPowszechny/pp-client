import {Range} from 'xpath-range';

export const EDITOR_NEW_ANNOTATION = 'EDITOR_NEW_ANNOTATION';
export const EDITOR_VISIBLE_CHANGE = 'EDITOR_VISIBLE_CHANGE';
export const VIEWER_VISIBLE_CHANGE = 'VIEWER_VISIBLE_CHANGE';
export const MENU_WIDGET_CHANGE = 'MENU_WIDGET_CHANGE';

export const showEditorNewAnnotation = (x: number, y: number, range: Range.SerializedRange) => {
  return {
    type: EDITOR_NEW_ANNOTATION,
    payload: {
      annotationId: null,
      range,
      visible: true,
      location: {
        x,
        y,
      },
    },
  };
};

// TODO sth like showEditorAnnotation for existing annotation edit

export const hideEditor = () => {
  return {
    type: EDITOR_VISIBLE_CHANGE,
    payload: {
      visible: false,
    },
  };
};

export const showMenu = ({ x, y }) => {
  return {
    type: MENU_WIDGET_CHANGE,
    payload: {
      visible: true,
      location: {
        x,
        y,
      },
    },
  };
};

export const hideMenu = () => {
  return {
    type: MENU_WIDGET_CHANGE,
    payload: {
      visible: false,
    },
  };
};

export const showViewer = (x: number, y: number, annotationIds: number[]) => {
  return {
    type: VIEWER_VISIBLE_CHANGE,
    payload: {
      annotationIds,
      visible: true,
      location: {
        x,
        y,
      },
    },
  };
};

export const hideViewer = () => {
  return {
    type: VIEWER_VISIBLE_CHANGE,
    payload: {
      visible: false,
    },
  };
};
