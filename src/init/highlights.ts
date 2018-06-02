import store from 'store';
import { showViewer } from 'store/actions';
import { mousePosition } from 'common/dom';
import Highlighter from 'core/Highlighter';
import { mouseOverViewer } from '../store/widgets/actions';

let instance;
let mouseDown = false;

function onMouseDown(e: MouseEvent) {
  if (e.button === 0) {
    mouseDown = true;
  }
}

function onMouseUp(e: MouseEvent) {
  if (e.button === 0) {
    mouseDown = false;
  }
}

function init(highlighter: Highlighter) {
  // This event subscription will last irrespective of whether annotations are redrawn or not
  highlighter.onHighlightEvent('mouseover', handleHighlightMouseEnter);
  highlighter.onHighlightEvent('mouseleave', handleHighlightMouseLeave);

  // Watch mouse button state;
  document.body.addEventListener('mousedown', onMouseDown);
  document.body.addEventListener('mouseup', onMouseUp);

  // subscribe to store changes and return unsubscribe fn
  const unsubscribe = store.subscribe(drawHighlights);

  // store objects required for later operations
  instance = {
    highlighter,
    unsubscribe,
  };
}

function deinit() {
  instance.unsubscribe();
  document.body.addEventListener('mousedown', onMouseDown);
  document.body.addEventListener('mouseup', onMouseUp);
}

function drawHighlights() {
  const annotations = store.getState().api.annotations.data;
  // nothing changed, do nothing
  if (annotations === instance.annotations) {
    return;
  }
  // save for later, to check if updates are needed
  instance.annotations = annotations;
  // and redraw
  instance.highlighter.drawAll(annotations.map(annotation => ({
    id: annotation.id,
    range: annotation.attributes.range,
    annotationData: annotation,
  })));
}

function handleHighlightMouseLeave(e, annotations) {
  store.dispatch(mouseOverViewer(false));
}

function handleHighlightMouseEnter(e, annotations) {
  // If the mouse button is currently depressed, we're probably trying to
  // make a selection, so we shouldn't show the viewer.
  if (mouseDown) {
    return;
  }
  const position = mousePosition(e);
  store.dispatch(showViewer(
    position.x,
    position.y,
    annotations.map(annotation => annotation.id),
  ));
}

export default {
  init,
  deinit,
};
