import _isEqual from 'lodash/isEqual';

import { QuoteAnnotationAPIModel } from 'common/api';
import { AnnotationRequestResourceType } from 'common/api/annotation-requests';
import { AnnotationResourceType } from 'common/api/annotations';
import { selectUser, trySelectStorage } from 'common/store/storage/selectors';
import { selectTab } from 'common/store/tabs/selectors';
import { showViewer } from 'common/store/tabs/tab/actions';
import { selectAnnotation, selectAnnotationRequest } from 'common/store/tabs/tab/api/selectors';
import { selectModeForCurrentPage } from 'common/store/tabs/tab/appModes/selectors';
import { selectViewerState } from 'common/store/tabs/tab/widgets/selectors';
import store from 'content-scripts/store';
import Highlighter, { instanceToHighlightId } from 'content-scripts/utils/Highlighter';

import { setsEqual } from '../../common/utils/collections';
import { annotationRootNode } from '../settings';
import mousePosition from '../utils/mousePosition';

let instance;

function init() {
  const highlighter = new Highlighter(annotationRootNode());

  // This event subscription will last irrespective of whether annotations are redrawn or not
  highlighter.onHighlightEvent('mouseover', handleHighlightMouseEnter);

  // subscribe to store changes and return unsubscribe fn
  const unsubscribe = store.subscribe(drawHighlights);

  chrome.runtime.onMessage.addListener(popupScrollToHighlightHandler);

  // store objects required for later operations
  instance = {
    highlighter,
    unsubscribe,
  };
}

function deinit() {
  instance.unsubscribe();
  chrome.runtime.onMessage.removeListener(popupScrollToHighlightHandler);
}

// TODO consider replacing with a React component, so listening for changes is not done manually
async function drawHighlights() {
  const user = selectUser(store.getState());
  const storage = trySelectStorage(store.getState());
  const arePageHighlightsDisabled = selectModeForCurrentPage(store.getState()).arePageHighlightsDisabled;
  const locatedAnnotationsIds =
    selectTab(store.getState()).annotations.located.map(annotation => annotation.annotationId);

  const locatedAnnotationRequestsIds =
    selectTab(store.getState()).annotationRequests.located.map(annotation => annotation.annotationId);

  if (storage && user) {
    // undraw all if the highlights have just been disabled
    if (arePageHighlightsDisabled && !instance.arePageHighlightsDisabled) {
      instance.highlighter.undrawAll();
    } else if (!arePageHighlightsDisabled) {

      // if located annotations changed or highglights have just been re-enabled, redraw them all
      if (
        !_isEqual(locatedAnnotationsIds, instance.locatedAnnotationsIds)
        || arePageHighlightsDisabled !== instance.arePageHighlightsDisabled
      ) {
        await instance.highlighter.drawAll(selectTab(store.getState()).annotations.located.map(
          ({ annotationId, range }) => {
            const annotation = selectAnnotation(store.getState(), annotationId);
            return {
              id: instanceToHighlightId(annotation),
              range,
              annotationData: annotation,
            };
          }));
      }

      // if located annotation requests changed or highglights have just been re-enabled, redraw them all
      if (
        !_isEqual(locatedAnnotationRequestsIds, instance.locatedAnnotationRequestsIds)
        || arePageHighlightsDisabled !== instance.arePageHighlightsDisabled
      ) {
        await instance.highlighter.drawAll(selectTab(store.getState()).annotationRequests.located.map(
          ({ annotationId, range }) => {
            const annotationRequest = selectAnnotationRequest(store.getState(), annotationId);
            return {
              id: instanceToHighlightId(annotationRequest),
              range,
              annotationData: annotationRequest,
            };
          }));
      }
    }

    instance.arePageHighlightsDisabled = arePageHighlightsDisabled;
    instance.locatedAnnotationsIds = locatedAnnotationsIds;
    instance.locatedAnnotationRequestsIds = locatedAnnotationRequestsIds;
  }
}

function handleHighlightMouseEnter(e, annotations: QuoteAnnotationAPIModel[]) {
  // If the mouse button is currently depressed, we're probably trying to
  // make a selection, so we shouldn't show the viewer.
  if (e.buttons !== 0) {
    return;
  }
  if (annotations.length > 0) {
    const {
      annotationIds,
      annotationRequestIds,
      isAnyReportEditorOpen,
      visible,
    } = selectViewerState(store.getState());

    if (isAnyReportEditorOpen) {
      return;
    }
    const newAnnotationIds = annotations.filter(item => item.type === AnnotationResourceType)
      .map(item => item.id);
    const newAnnotationRequestIds = annotations.filter(item => item.type === AnnotationRequestResourceType)
      .map(item => item.id);
    const itemsChanged =
      !setsEqual(annotationIds, newAnnotationIds) || !setsEqual(annotationRequestIds, newAnnotationRequestIds);
    if (!visible || itemsChanged) {
      const position = mousePosition(e);
      store.dispatch(showViewer(
        position.x,
        position.y,
        newAnnotationIds,
        newAnnotationRequestIds,
      ));
    }
  }
}

function popupScrollToHighlightHandler(request, sender, sendResponse) {
  if (request.action === 'SCROLL_TO_HIGHLIGHT') {
    const { highlightId } = request.payload;
    console.debug(`Request from popup to scroll to highlight: ${highlightId}`);
    try {
      instance.highlighter.scrollToHighlight(highlightId);
    } catch (e) {
      console.warn(`Could not scroll to annotation ${highlightId}: ${e.message}`);
    }
  }
}

export default {
  init,
  deinit,
};
