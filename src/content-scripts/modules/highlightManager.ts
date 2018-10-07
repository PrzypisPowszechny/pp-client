import store from 'content-scripts/store';
import { showViewer } from 'content-scripts/store/actions';
import { mousePosition } from '../utils/dom';
import Highlighter from 'content-scripts/utils/Highlighter';
import { setMouseOverViewer } from '../store/widgets/actions';
import { selectModeForCurrentPage } from '../store/appModes/selectors';
import _difference from 'lodash/difference';
import _isEqual from 'lodash/isEqual';
import { selectViewerState } from '../store/widgets/selectors';
import { selectAnnotation } from '../store/api/selectors';
import { annotationRootNode } from '../main';

let instance;

function init() {
  const highlighter = new Highlighter(annotationRootNode());

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
  const locatedAnnotationsIds = store.getState().annotations.located.map(annotation => annotation.annotationId);
  if (arePageHighlightsDisabled && !instance.arePageHighlightsDisabled) {
    instance.highlighter.undrawAll();
  } else if (!arePageHighlightsDisabled &&
    (!_isEqual(locatedAnnotationsIds, instance.locatedAnnotationsIds)
      || arePageHighlightsDisabled !== instance.arePageHighlightsDisabled
    )
  ) {
    // located annotations have changed, so redraw them
    instance.highlighter.drawAll(store.getState().annotations.located.map(({ annotationId, range }) => {
      return {
        id: annotationId,
        range,
        annotationData: selectAnnotation(store.getState(), annotationId),
      };
    }));
  }

  instance.arePageHighlightsDisabled = arePageHighlightsDisabled;
  instance.locatedAnnotationsIds = locatedAnnotationsIds;
}

function handleHighlightMouseLeave(e, annotations) {
  if (e.buttons !== 0) {
    return;
  }
  store.dispatch(setMouseOverViewer(false));
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
