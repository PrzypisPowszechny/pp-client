import store from 'store';
import { showViewer } from 'store/actions';
import { mousePosition } from 'common/dom';
import Highlighter from 'core/Highlighter';
import { mouseOverViewer } from '../store/widgets/actions';
import { selectModeForCurrentPage } from '../store/appModes/selectors';
import _difference from 'lodash/difference';
import { selectViewerState } from '../store/widgets/selectors';

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
  const arePageHighlightsDisabled = selectModeForCurrentPage(store.getState()).arePageHighlightsDisabled;
  const annotations = store.getState().api.annotations.data;
  if (arePageHighlightsDisabled && !instance.arePageHighlightsDisabled) {
    instance.highlighter.undrawAll();
  } else if (!arePageHighlightsDisabled &&
    (annotations !== instance.annotations || arePageHighlightsDisabled !== instance.arePageHighlightsDisabled)
  ) {
    instance.highlighter.drawAll(annotations.map(annotation => ({
      id: annotation.id,
      range: annotation.attributes.range,
      annotationData: annotation,
    })));
  }

  // save for later, to check if updates are needed
  instance.annotations = annotations;
  instance.arePageHighlightsDisabled = arePageHighlightsDisabled;
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

  const {
    annotationIds,
    isAnyReportEditorOpen,
    visible,
  } = selectViewerState(store.getState());

  if (!isAnyReportEditorOpen) {
    // Open a new Viewer only when
    // - the viewer is not visible
    // - the displayed annotations have changed, too. This prevents the widget from shifting location
    //   every time the user's cursor slips off the widget
    const newIds = annotations.map(item => item.id);
    const annotationsChanged =
      _difference(annotationIds, newIds).length !== 0 || _difference(newIds, annotationIds).length !== 0;
    if (!visible || annotationsChanged) {
      const position = mousePosition(e);
      store.dispatch(showViewer(
        position.x,
        position.y,
        annotations.map(annotation => annotation.id),
      ));
    }
  }
}

export default {
  init,
  deinit,
};
