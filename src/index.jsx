import React from 'react';
import {render} from 'react-dom';
import ReactDOM from 'react-dom';
import annotator from 'annotator';


var $ = annotator.util.$;
var pp_annotator = require('./pp-annotator/pp-annotator');

var annotation_prefix = 'http://localhost:8080';

console.log("Przypis script working!");



// will run only in browser environment
if (typeof window !== 'undefined') {
    var annotator_app = new annotator.App();
    annotator_app.include(pp_annotator.ui); // {viewerExtensions: [exports.viewerExtension]});
    // annotator_app.include(annotator.ui.main)
    annotator_app.include(annotator.storage.debug);
    // annotator_app.include(annotator.storage.http, {prefix: annotation_prefix});
    annotator_app.start();
}