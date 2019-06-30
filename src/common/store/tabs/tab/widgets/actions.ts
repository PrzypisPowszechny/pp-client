import { ID } from 'common/api/json-api';
import { IAnnotationRequestFormData } from 'common/store/tabs/tab/widgets/reducers';
import { ToastType } from 'content-scripts/components/elements/Toast/Toast';
import { AnnotationLocation } from 'content-scripts/handlers/annotation-event-handlers';

export const EDITOR_ANNOTATION = 'EDITOR_ANNOTATION';
export const SET_EDITOR_SELECTION_RANGE = 'SET_EDITOR_SELECTION_RANGE';
export const EDITOR_VISIBLE_CHANGE = 'EDITOR_VISIBLE_CHANGE';
export const ANNOTATION_REQUEST_FORM_VISIBLE_CHANGE = 'ANNOTATION_REQUEST_FORM_VISIBLE_CHANGE';
export const ANNOTATION_FORM_VISIBLE_CHANGE = 'ANNOTATION_FORM_VISIBLE_CHANGE';

export const VIEWER_VISIBLE_CHANGE = 'VIEWER_VISIBLE_CHANGE';
export const VIEWER_MOUSE_CHANGE = 'VIEWER_MOUSE_CHANGE';

export const VIEWER_MODAL_CHANGE = 'VIEWER_MODAL_CHANGE';
export const VIEWER_REPORT_EDITOR_CHANGE = 'VIEWER_REPORT_EDITOR_CHANGE';
export const MENU_WIDGET_CHANGE = 'MENU_WIDGET_CHANGE';
export const NOTIFICATION_CHANGE = 'NOTIFICATION_CHANGE';

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

export const setSelectionRange = (annotationLocation: AnnotationLocation) => {
  return {
    type: SET_EDITOR_SELECTION_RANGE,
    payload: {
      annotationLocation,
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

export const showAnnotationRequestForm = (initialData: Partial<IAnnotationRequestFormData>)  => {
  return {
    type: ANNOTATION_REQUEST_FORM_VISIBLE_CHANGE,
    payload: {
      visible: true,
      initialData,
    },
  };
};

export const hideAnnotationRequestForm = () => {
  return {
    type: ANNOTATION_REQUEST_FORM_VISIBLE_CHANGE,
    payload: {
      visible: false,
      initialData: null,
    },
  };
};

export const showAnnotationAddForm = (annotationRequestId: ID) => {
  return {
    type: ANNOTATION_FORM_VISIBLE_CHANGE,
    payload: {
      visible: true,
      annotationId: null,
      annotationRequestId,
    },
  };
};

export const showAnnotationEditForm = (annotationId: ID) => {
  return {
    type: ANNOTATION_FORM_VISIBLE_CHANGE,
    payload: {
      visible: true,
      annotationId,
      annotationRequestId: null,
    },
  };
};

export const hideAnnotationForm = () => {
  return {
    type: ANNOTATION_FORM_VISIBLE_CHANGE,
    payload: {
      visible: false,
    },
  };
};

// TODO refactor viewer actions
export const showViewer = (x: number, y: number, annotationIds: string[], annotationRequestIds: string[]) => {
  return {
    type: VIEWER_VISIBLE_CHANGE,
    payload: {
      annotations: annotationIds.map(id => ({ annotationId: id })),
      annotationRequests: annotationRequestIds.map(id => ({ annotationRequestId: id })),
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

export const setMouseOverViewer = (value: boolean) => {
  return {
    type: VIEWER_MOUSE_CHANGE,
    payload: {
      mouseOver: value,
    },
  };
};

export const openViewerDeleteModal = (id: string) => {
  return {
    type: VIEWER_MODAL_CHANGE,
    payload: {
      isDeleteModalOpen: true,
      deleteModalId: id,
    },
  };
};

export const hideViewerDeleteModal = () => {
  return {
    type: VIEWER_MODAL_CHANGE,
    payload: {
      isDeleteModalOpen: false,
      deleteModalId: null,
    },
  };
};

export const changeViewerReportEditorOpen = (annotationId: string, isReportEditorOpen: boolean) => {
  return {
    type: VIEWER_REPORT_EDITOR_CHANGE,
    payload: {
      annotationId,
      isReportEditorOpen,
    },
  };
};

export const changeNotification = (visible: boolean, message?: string, type?: ToastType) => {
    return {
    type: NOTIFICATION_CHANGE,
    payload: {
      message,
      visible,
      type,
    },
  };
};
