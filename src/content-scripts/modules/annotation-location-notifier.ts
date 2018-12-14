import store from 'content-scripts/store';
import { selectAnnotation } from '../store/api/selectors';
import * as DOMNotifications from '../dom-notifications';

let instance;

export default {
  init,
  deinit,
};

function init() {
  // subscribe to store changes and return unsubscribe fn
  const unsubscribe = store.subscribe(markLocatedAnnotations);

  // store objects required for later operations
  instance = {
    unsubscribe,
  };
}

function deinit() {
  instance.unsubscribe();
}

// save the annotation location information to DOM for reads in selenium + in console
function markLocatedAnnotations() {
  const state = store.getState();
  if (state.annotations.hasLoaded) {
    const located = state.annotations.located.map(location =>
      selectAnnotation(state, location.annotationId),
    );
    const unlocated = state.annotations.unlocated.map(id =>
      selectAnnotation(state, id),
    );

    if (unlocated.length > 0) {
      console.warn(`${unlocated.length} annotations have not been located`);
    }
    console.info(`${located.length} annotations have been located`);
    DOMNotifications.setAnnotationLocationInfo({ located, unlocated });
  }
}
