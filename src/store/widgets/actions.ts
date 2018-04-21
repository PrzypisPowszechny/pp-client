export const EDITOR_VISIBLE_CHANGE = 'EDITOR_VISIBLE_CHANGE';
export const MENU_WIDGET_CHANGE = 'MENU_WIDGET_CHANGE';
export const EDITOR_NEW_ANNOTATION = 'EDITOR_NEW_ANNOTATION';

export const showEditorNewAnnotation = (x: number, y: number) => {
  return {
    type: EDITOR_NEW_ANNOTATION,
    payload: {
      annotationId: null,
      visible: true,
      location: {
        x,
        y,
      },
    },
  };
};

export const showMenu = (visible, { x, y }) => {
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

export const showEditor = () => {
  return {
    type: EDITOR_VISIBLE_CHANGE,
    payload: {
      visible: true,
    },
  };
};

export const hideEditor = () => {
  return {
    type: EDITOR_VISIBLE_CHANGE,
    payload: {
      visible: false,
    },
  };
};

export const setEditor = (visible, x, y) => {
  return {
    type: EDITOR_VISIBLE_CHANGE,
    payload: {
      visible,
      location: {
        x,
        y,
      },
    },
  };
};
