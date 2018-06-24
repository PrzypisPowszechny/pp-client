import store from 'store';
import { showViewer } from 'store/actions';
import { mousePosition } from 'common/dom';
import Highlighter from 'core/Highlighter';
import { mouseOverViewer } from '../store/widgets/actions';

let instance;

function init(highlighter: Highlighter) {
  // This event subscription will last irrespective of whether annotations are redrawn or not
  highlighter.onHighlightEvent('mouseover', handleHighlightMouseEnter);
  highlighter.onHighlightEvent('mouseleave', handleHighlightMouseLeave);

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
  const disabledExtension = store.getState().appModes.disabledExtension;
  const annotations = store.getState().api.annotations.data;
  console.log(disabledExtension, annotations);
  // nothing changed, do nothing
  if (annotations === instance.annotations && disabledExtension === instance.disabledExtension) {
    return;
  }

  console.log(disabledExtension, annotations);
  if (disabledExtension && !instance.disabledExtension) {
    instance.highlighter.undrawAll();
  } else {
    // and redraw
    instance.highlighter.drawAll(annotations.map(annotation => ({
      id: annotation.id,
      range: annotation.attributes.range,
      annotationData: annotation,
    })));
  }

  // save for later, to check if updates are needed
  instance.annotations = annotations;
  instance.disabledExtension = disabledExtension;
}

function handleHighlightMouseLeave(e, annotations) {
  if (e.buttons !== 0) {
    return;
  }
  store.dispatch(mouseOverViewer(false));
}

function handleHighlightMouseEnter(e, annotations) {
  // If the mouse button is currently depressed, we're probably trying to
  // make a selection, so we shouldn't show the viewer.
  if (e.buttons !== 0) {
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
