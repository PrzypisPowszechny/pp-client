import $ from 'jquery';

export interface IVec2 {
  x: number;
  y: number;
}

export interface IPosition {
  top: number;
  left: number;
}

// ANNOTATOR FUNCTIONS (copied from annotator.ui.editor)

/**
 * dragTracker is a function which allows a callback to track changes made to
 * the position of a draggable "handle" element.
 *
 * handle - A DOM element to make draggable
 * callback - Callback function
 *
 * Callback arguments:
 *
 * delta - An Object with two properties, "x" and "y", denoting the amount the
 * mouse has moved since the last (tracked) call.
 *
 * Callback returns: Boolean indicating whether to track the last movement. If
 * the movement is not tracked, then the amount the mouse has moved will be
 * accumulated and passed to the next mousemove event.
 */
export class DragTracker {

  lastPos: IPosition;
  throttled: boolean;
  handle: Node;
  downCallback: (Event) => void;
  moveCallback: (IVec2) => boolean;
  upCallback: () => void;

  constructor(handle: Node,
              downCallback: (e: Event) => void,
              moveCallback: (delta: IVec2) => boolean,
              upCallback: () => void,
  ) {
    this.lastPos = null;
    this.throttled = false;
    this.handle = handle;
    this.downCallback = downCallback;
    this.moveCallback = moveCallback;
    this.upCallback = upCallback;

    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseMove = this.mouseMove.bind(this);

    $(handle).on('mousedown', this.mouseDown);
  }

  // Event handler for mousemove
  mouseMove(e: JQuery.Event) {
    if (this.throttled || this.lastPos === null) {
      return;
    }

    const delta = {
      y: e.pageY - this.lastPos.top,
      x: e.pageX - this.lastPos.left,
    };

    let trackLastMove = true;
    // The callback function can return false to indicate that the tracker
    // shouldn't keep updating the last position. This can be used to
    // implement "walls" beyond which (for example) resizing has no effect.
    if (typeof this.moveCallback === 'function') {
      trackLastMove = this.moveCallback(delta);
    }

    if (trackLastMove !== false) {
      this.lastPos = {
        top: e.pageY,
        left: e.pageX,
      };
    }

    // Throttle repeated mousemove events
    this.throttled = true;
    requestAnimationFrame(() => {
      this.throttled = false;
    });
  }

  // Event handler for mouseup
  mouseUp() {
    this.lastPos = null;
    $(this.handle.ownerDocument)
      .off('mouseup', this.mouseUp)
      .off('mousemove', this.mouseMove);
    if (typeof this.upCallback === 'function') {
      this.upCallback();
    }
  }

  // Event handler for mousedown -- starts drag tracking
  mouseDown(e: JQuery.Event) {
    if (e.target !== this.handle) {
      return;
    }

    this.lastPos = {
      top: e.pageY,
      left: e.pageX,
    };

    $(this.handle.ownerDocument)
      .on('mouseup', this.mouseUp)
      .on('mousemove', this.mouseMove);

    e.preventDefault();

    if (typeof this.downCallback === 'function') {
      this.downCallback(e);
    }
  }

  // Public: turn off drag tracking for this dragTracker object.
  destroy() {
    $(this.handle).off('mousedown', this.mouseDown);
  }
}
