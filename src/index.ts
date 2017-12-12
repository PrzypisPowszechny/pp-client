import App from './pp-annotator/modules/App';
import PPUI from './pp-annotator/modules/PPUI';
// import { debug } from './pp-annotator/legacy/old-storage';
import DebugStorage from './pp-annotator/api/DebugStorage';

console.log('Przypis script working!'); // tslint:disable-line

// will run only in browser environment
if (typeof window !== 'undefined') {
  const annotatorApp = new App();
  annotatorApp.include(PPUI);
  annotatorApp.include(DebugStorage);
  annotatorApp.start();
}
