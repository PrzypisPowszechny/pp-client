import annotator from 'annotator';

import { ui as PPUI } from './pp-annotator/pp-annotator';

console.log('Przypis script working!'); // tslint:disable-line

// will run only in browser environment
if (typeof window !== 'undefined') {
  const annotatorApp = new annotator.App();
  annotatorApp.include(PPUI);
  annotatorApp.include(annotator.storage.debug);
  annotatorApp.start();
}
