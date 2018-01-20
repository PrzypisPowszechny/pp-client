import App from './pp-annotator/modules/App';
import PPUI from './pp-annotator/modules/PPUI';
import DebugStorage from './pp-annotator/api/DebugStorage';

import ViewerWidget from './pp-annotator/viewer/ViewerWidget';
import AnnotationViewModel from './pp-annotator/annotation/AnnotationViewModel';

// import global files
import 'css/viewer.scss';
import 'css/editor.scss';

import IPPSettings from './PPSettings.interface';
declare const PP_SETTINGS: IPPSettings;

// Optional external hardcoded annotations
import input_annotations from '../config/annotations.json';

console.log('Przypis script working!');

function startApp() {
  const annotatorApp = new App();
  annotatorApp.include(PPUI);
  annotatorApp.include(DebugStorage);
  annotatorApp.start();
  return annotatorApp;
}

function attachMockViewer() {
  // IMPORTANT: very implementation dependent; whenever ViewerWidget changes break it, consider simply dropping it
  const viewer = new ViewerWidget({});
  viewer.attach();

  const annotation = new AnnotationViewModel({});
  // mock data to display
  annotation.comment = 'Testowy komentarz '.repeat(10);
  annotation.referenceLinkTitle = 'Strona organizacji XYZ '.repeat(3);
  const position = {
    top: 500,
    left: 200,
  };

  viewer.load([annotation], position);
  // make the window visible
  viewer.element.removeClass(ViewerWidget.classes.hide);
  // turn off the mouseleave listeners so that windows does not disappear on cursor action
  viewer.element.off('mouseleave.' + ViewerWidget.nameSpace);
}

function attachAnnotationsFromFile(annotatorApp: App) {
  // Reassign annotations' ids starting from 1000
  // so they don't collide with the ids of the annotations created through the application
  let id = 1000;
  for (const annotation of input_annotations) {
    if (annotation.url === window.location.href) {
      annotation.id = id;
      annotatorApp.annotations.create(annotation);
      id += 1;
    }
  }
  console.log('Loaded ' + input_annotations.length + ' annotations from the annotation file.');
}

const isBrowser = typeof window !== 'undefined';
if (isBrowser) {
  // Start the app
  const annotatorApp = startApp();

  /*
   MOCK FUNCTIONALITY for development purposes
   Enabled in `config/app-settings.js`
   */
  if (PP_SETTINGS.MOCK_VIEWER) {
    attachMockViewer();
  }

  /*
   Read hardcoded annotations for UX research purposes from a file (only if the storage is local)
   */
  const storage = annotatorApp.registry.getUtility('storage');
  if (PP_SETTINGS.READ_ANNOTATIONS_FROM_FILE && storage instanceof DebugStorage) {
    attachAnnotationsFromFile(annotatorApp);
  }
}
