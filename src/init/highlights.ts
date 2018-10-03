import store from 'store';
import { showViewer } from 'store/actions';
import { mousePosition } from 'common/dom';
import Highlighter from 'core/Highlighter';
import { setMouseOverViewer } from '../store/widgets/actions';
import { selectModeForCurrentPage } from '../store/appModes/selectors';
import _difference from 'lodash/difference';
import { selectViewerState } from '../store/widgets/selectors';
import { selectAnnotations } from '../store/api/selectors';
import { uniqueTextToXPathRange } from '../utils/annotations';

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
  const annotations = selectAnnotations(store.getState());
  if (arePageHighlightsDisabled && !instance.arePageHighlightsDisabled) {
    instance.highlighter.undrawAll();
  } else if (!arePageHighlightsDisabled &&
    (annotations !== instance.annotations || arePageHighlightsDisabled !== instance.arePageHighlightsDisabled)
  ) {
    const annotationsToDraw = annotations.map((annotation) => {
      const { quote, range } = annotation.attributes;
      let locatedRange;
      // Currently the range returned from server is never literally empty and is always parsed to an Object;
      // To check if range is provided, check for an Object with no keys
      const isRangeProvided = range && Object.keys(range).length > 0;
      if (isRangeProvided) {
        locatedRange = range;
      } else {
        locatedRange = uniqueTextToXPathRange(quote, document.body);
      }
      if (locatedRange) {
        return {
          id: annotation.id,
          range: locatedRange,
          annotationData: annotation,
        };
      } else {
        return null;
      }
    }).filter(annotation => annotation);
    instance.highlighter.drawAll(annotationsToDraw);
  }

  // save for later, to check if updates are needed
  instance.annotations = annotations;
  instance.arePageHighlightsDisabled = arePageHighlightsDisabled;
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
