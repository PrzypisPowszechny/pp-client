import {
    EDITOR_VISIBLE_CHANGE,
} from "./consts";

export interface IEditorVisibleChangeAction {
  type: string;
  payload: {
    visible: boolean;
    location?: {
      x: number;
      y: number;
    }
  };
}

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
