import { Range } from 'xpath-range';

export const EDITOR_ANNOTATION = 'EDITOR_ANNOTATION';
export const SET_EDITOR_SELECTION_RANGE = 'SET_EDITOR_SELECTION_RANGE';
export const EDITOR_VISIBLE_CHANGE = 'EDITOR_VISIBLE_CHANGE';
export const VIEWER_VISIBLE_CHANGE = 'VIEWER_VISIBLE_CHANGE';
export const VIEWER_MODAL_CHANGE = 'VIEWER_MODAL_CHANGE';
export const MENU_WIDGET_CHANGE = 'MENU_WIDGET_CHANGE';

export const showEditorAnnotation = (x: number, y: number, id?: string) => {
  return {
    type: EDITOR_ANNOTATION,
    payload: {
      annotationId: id,
      visible: true,
      location: {
        x,
        y,
      },
    },
  };
};

export const setSelectionRange = (range: Range.SerializedRange) => {
  return {
    type: SET_EDITOR_SELECTION_RANGE,
    payload: {
      range,
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
      mouseOver: true,
      deleteModal: {},
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

export const mouseOverViewer = (value: boolean) => {
  return {
    type: VIEWER_VISIBLE_CHANGE,
    payload: {
      mouseOver: value,
    },
  };
};

export const openViewerDeleteModal = (id: string) => {
  return {
    type: VIEWER_MODAL_CHANGE,
    payload: {
      deleteModalOpen: true,
      deleteModalId: id,
    },
  };
};

export const hideViewerDeleteModal = () => {
  return {
    type: VIEWER_MODAL_CHANGE,
    payload: {
      deleteModalOpen: false,
      deleteModalId: null,
    },
  };
};
