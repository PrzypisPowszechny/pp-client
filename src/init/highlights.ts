import store from 'store';
import { showViewer } from 'store/actions';
import { mousePosition } from 'common/dom';
import Highlighter from 'core/Highlighter';

let instance;

function init(highlighter: Highlighter) {
  // This event subscription will last irrespective of whether annotations are redrawn or not
  highlighter.onHighlightEvent('mouseover', handleHighlightEvent);

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

function handleHighlightEvent(e, annotations) {
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
