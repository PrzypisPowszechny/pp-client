import _difference from 'lodash/difference';
import _isEqual from 'lodash/isEqual';

import { QuoteAnnotationAPIModel } from 'common/api';
import { AnnotationRequestAPIModel } from 'common/api/annotation-requests';
import * as resourceTypes from 'common/api/resource-types';
import { selectUser, trySelectStorage } from 'common/store/storage/selectors';
import { selectTab } from 'common/store/tabs/selectors';
import { showAnnotationForm, showViewer } from 'common/store/tabs/tab/actions';
import { selectAnnotation, selectAnnotationRequest } from 'common/store/tabs/tab/api/selectors';
import { selectModeForCurrentPage } from 'common/store/tabs/tab/appModes/selectors';
import { setMouseOverViewer } from 'common/store/tabs/tab/widgets/actions';
import { selectViewerState } from 'common/store/tabs/tab/widgets/selectors';
import store from 'content-scripts/store';
import Highlighter from 'content-scripts/utils/Highlighter';

import { annotationRootNode } from '../settings';
import mousePosition from '../utils/mousePosition';

let instance;

function init() {
  const highlighter = new Highlighter(annotationRootNode());

  // This event subscription will last irrespective of whether annotations are redrawn or not
  highlighter.onHighlightEvent('mouseover', handleHighlightMouseEnter);
  highlighter.onHighlightEvent('mouseleave', handleHighlightMouseLeave);

  // Temporarily open annotation request form on highlight click
  highlighter.onHighlightEvent('click', handleHighlightMouseClick);

  // subscribe to store changes and return unsubscribe fn
  const unsubscribe = store.subscribe(drawHighlights);

  chrome.runtime.onMessage.addListener(popupScrollToAnnotationHandler);

  // store objects required for later operations
  instance = {
    highlighter,
    unsubscribe,
  };
}

function deinit() {
  instance.unsubscribe();
  chrome.runtime.onMessage.removeListener(popupScrollToAnnotationHandler);
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
            return {
              id: `annotation:${annotationId}`,
              range,
              annotationData: selectAnnotation(store.getState(), annotationId),
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
            return {
              id: `annotationRequest:${annotationId}`,
              range,
              annotationData: selectAnnotationRequest(store.getState(), annotationId),
            };
          }));
      }
    }

    instance.arePageHighlightsDisabled = arePageHighlightsDisabled;
    instance.locatedAnnotationsIds = locatedAnnotationsIds;
    instance.locatedAnnotationRequestsIds = locatedAnnotationRequestsIds;
  }
}

function handleHighlightMouseClick(e, annotations: QuoteAnnotationAPIModel[]) {
  const annotationRequests: AnnotationRequestAPIModel[]
    = annotations.filter(item => item.type === resourceTypes.ANNOTATION_REQUESTS) as any;
  // TODO open editor answering to this annotation request; this is just an example of using this annotation request
  const annotationRequest = annotationRequests[0];
  // we can display multiple annotation requests that overlap and we can display them in annotation request viewer,
  // so only one can be selected for answerring
  // for now use the first one to simplify
  store.dispatch(showAnnotationForm(annotationRequest.id));
}

function handleHighlightMouseLeave(e, annotations: QuoteAnnotationAPIModel[]) {
  if (e.buttons !== 0) {
    return;
  }
  store.dispatch(setMouseOverViewer(false));
}

function handleHighlightMouseEnter(e, annotations: QuoteAnnotationAPIModel[]) {
  // If the mouse button is currently depressed, we're probably trying to
  // make a selection, so we shouldn't show the viewer.
  if (e.buttons !== 0) {
    return;
  }
  annotations = annotations.filter(item => item.type === resourceTypes.ANNOTATIONS);
  if (annotations.length > 0) {
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
}

function popupScrollToAnnotationHandler(request, sender, sendResponse) {
  if (request.action === 'SCROLL_TO_ANNOTATION') {
    const { annotationId } = request.payload;
    console.debug(`Request from popup to scroll to annotation id: ${annotationId}`);
    try {
      instance.highlighter.scrollToAnnotation(annotationId);
    } catch (e) {
      console.warn(`Could not scroll to annotation ${annotationId}: ${e.message}`);
    }
  }
}

export default {
  init,
  deinit,
};
