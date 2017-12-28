import App from './pp-annotator/modules/App';
import PPUI from './pp-annotator/modules/PPUI';
// import { debug } from './pp-annotator/legacy/old-storage';
import DebugStorage from './pp-annotator/api/DebugStorage';

import PrzypisViewer from './pp-annotator/viewer/PrzypisViewer';
import {AnnotationViewModel} from './pp-annotator/annotation';

console.log('Przypis script working!'); // tslint:disable-line

// will run only in browser environment
if (typeof window !== 'undefined') {
  /*
    Start the annotating functionality
   */
  const annotatorApp = new App();
  annotatorApp.include(PPUI);
  annotatorApp.include(DebugStorage);
  annotatorApp.start();

  /*
    MOCK FUNCTIONALITY for development purposes
    Enabled in `config/webpack.dev.js`
   */
  if (process.env.PP_DEV_MOCK_VIEWER) {
    // IMPORTANT: very implementation dependent; whenever PrzypisViewer changes break it, consider simply removing it
    const viewer = new PrzypisViewer({});
    viewer.attach();

    const annotation = new AnnotationViewModel({});
    // mock data to display
    annotation.comment = 'Testowy komentarz';
    annotation.referenceLinkTitle = 'Strona organizacji XYZ';
    const position = {
          top: 500,
          left: 200,
        };

    viewer.load([annotation], position);
    // make the window visible
    viewer.element.removeClass('annotator-hide');
  }
}
