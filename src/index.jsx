import annotator from 'annotator';

import { ui as PPUI } from './pp-annotator/pp-annotator';

console.log("Przypis script working!");

// will run only in browser environment
if (typeof window !== 'undefined') {
    /* old annotator stuff, TODO remove?
    {viewerExtensions: [exports.viewerExtension]});
    annotator_app.include(annotator.ui.main)
    annotator_app.include(annotator.storage.http, {prefix: annotation_prefix});
     */

    const annotator_app = new annotator.App();
    annotator_app.include(PPUI);
    annotator_app.include(annotator.storage.debug);
    annotator_app.start();
}
