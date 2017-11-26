// Annotator base classes
import { util } from 'annotator';

// The same dependencies as annotator's for consistency (at least for now)
const { $ } = util;

interface IVec2 {
  x: number;
  y: number;
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
export function dragTracker(handle: Node, callback: (delta: IVec2) => boolean) {
  let lastPos: util.IPosition | null = null;
  let throttled = false;

  // Event handler for mousemove
  function mouseMove(e: JQuery.Event) {
    if (throttled || lastPos === null) {
      return;
    }

    const delta = {
      y: e.pageY - lastPos.top,
      x: e.pageX - lastPos.left
    };

    let trackLastMove = true;
    // The callback function can return false to indicate that the tracker
    // shouldn't keep updating the last position. This can be used to
    // implement "walls" beyond which (for example) resizing has no effect.
    if (typeof callback === 'function') {
      trackLastMove = callback(delta);
    }

    if (trackLastMove !== false) {
      lastPos = {
        top: e.pageY,
        left: e.pageX
      };
    }

    // Throttle repeated mousemove events
    throttled = true;
    setTimeout(() => {
      throttled = false;
    }, 1000 / 60);
  }

  // Event handler for mouseup
  function mouseUp() {
    lastPos = null;
    $(handle.ownerDocument)
      .off('mouseup', mouseUp)
      .off('mousemove', mouseMove);
  }

  // Event handler for mousedown -- starts drag tracking
  function mouseDown(e: JQuery.Event) {
    if (e.target !== handle) {
      return;
    }

    lastPos = {
      top: e.pageY,
      left: e.pageX
    };

    $(handle.ownerDocument)
      .on('mouseup', mouseUp)
      .on('mousemove', mouseMove);

    e.preventDefault();
  }

  // Public: turn off drag tracking for this dragTracker object.
  function destroy() {
    $(handle).off('mousedown', mouseDown);
  }

  $(handle).on('mousedown', mouseDown);

  return { destroy };
}

/**
 * resizer is a component that uses a dragTracker under the hood to track the
 * dragging of a handle element, using that motion to resize another element.
 *
 * element - DOM Element to resize
 * handle - DOM Element to use as a resize handle
 * options - Object of options.
 *
 * Available options:
 *
 * invertedX - If this option is defined as a function, and that function
 * returns a truthy value, the horizontal sense of the drag will be
 * inverted. Useful if the drag handle is at the left of the
 * element, and so dragging left means "grow the element"
 * invertedY - If this option is defined as a function, and that function
 * returns a truthy value, the vertical sense of the drag will be
 * inverted. Useful if the drag handle is at the bottom of the
 * element, and so dragging down means "grow the element"
 */
export function resizer(
  element: Element,
  handle: Node,
  options: {
    invertedX?: () => boolean;
    invertedY?: () => boolean;
  }
) {
  const $el = $(element);
  if (typeof options === 'undefined' || options === null) {
    options = {};
  }

  // Translate the delta supplied by dragTracker into a delta that takes
  // account of the invertedX and invertedY callbacks if defined.
  function translate(delta: IVec2) {
    let directionX = 1;
    let directionY = -1;

    if (typeof options.invertedX === 'function' && options.invertedX()) {
      directionX = -1;
    }
    if (typeof options.invertedY === 'function' && options.invertedY()) {
      directionY = 1;
    }

    return {
      x: delta.x * directionX,
      y: delta.y * directionY
    };
  }

  // Callback for dragTracker
  function resize(delta: IVec2) {
    const height = $el.height();
    const width = $el.width();
    const translated = translate(delta);

    if (Math.abs(translated.x) > 0) {
      $el.width(width || 0 + translated.x);
    }
    if (Math.abs(translated.y) > 0) {
      $el.height(height || 0 + translated.y);
    }

    // Did the element dimensions actually change? If not, then we've
    // reached the minimum size, and we shouldn't track
    return $el.height() !== height || $el.width() !== width;
  }

  // We return the dragTracker object in order to expose its methods.
  return dragTracker(handle, resize);
}

/**
 * mover is a component that uses a dragTracker under the hood to track the
 * dragging of a handle element, using that motion to move another element.
 *
 * element - DOM Element to move
 * handle - DOM Element to use as a move handle
 */
export function mover(element: Element, handle: Node) {
  function move(delta: IVec2) {
    $(element).css({
      top: parseInt($(element).css('top'), 10) + delta.y,
      left: parseInt($(element).css('left'), 10) + delta.x
    });
    return true;
  }

  // We return the dragTracker object in order to expose its methods.
  return dragTracker(handle, move);
}
