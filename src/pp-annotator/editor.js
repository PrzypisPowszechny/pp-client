var Editor = require('annotator').ui.editor.Editor;
var Widget = require('annotator').ui.widget.Widget;
var util = require('annotator').util;


var $ = util.$;
var Promise = util.Promise;
var NS = "annotator-editor";



// React imports
var ReactDOM = require('react-dom');
var React = require('react');
import AnnotationForm from './form.jsx';

// preventEventDefault copied from annotator.ui.editor
function preventEventDefault(event) {
    if (typeof event !== 'undefined' &&
        event !== null &&
        typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
}


/*
annotator.ui.editor.Editor extension
- without Editor field add and load mechanism (and React-rendered form)

Css and show/hide functionality of the outer editor container is nevertheless inherited.
 */
var PrzypisEditor = exports.PrzypisEditor = Editor.extend({

    // calls directly Widget, which is Editor's prototype
    constructor: function (options) {
        // ignore Editor.constructor
        Widget.call(this, options);

        this.onSave = this.options.onSave;
        this.onCancel = this.options.onCancel;

        this.fields = [];
        this.annotation = {};
    },

    updateForm: function (annotation) {
        ReactDOM.render(
            React.createElement(AnnotationForm,
                $.extend(this.formEvents(), annotation),
                null),
            document.getElementById('react-form-slot')
        );
    },

    formEvents: function() {
        var self = this;
        return {
                    onSave: function (e) {
                        self._onSaveClick(e);
                    },
                    onCancel: function (e) {
                        self._onCancelClick(e);
                    },
                    updateAnnotationWithState: function(state) {
                        // Update annotation field values with the state of the React form
                        self.annotation.fields = $.extend(self.annotation.fields, state);
                    }
                };
    },
    // Override parent attach function to render React form
    attach: function() {
        // Call parent function (renders PrzypisEditor.template)
        Editor.prototype.attach.call(this);
        this.updateForm({});
    },

    // Shortened original Editor submit: field values are passed through updateAnnotationWithState
    // The rest is left unchanged
    submit: function () {
        if (typeof this.dfd !== 'undefined' && this.dfd !== null) {
            this.dfd.resolve(this.annotation);
        }
        this.hide();
    },


    load: function (annotation, position) {
        this.annotation = annotation;
        this.updateForm(annotation.fields);

        var self = this;
        return new Promise(function (resolve, reject) {
            self.dfd = {resolve: resolve, reject: reject};
            self.show(position);
        });
    },

});


// Copied from annotator.ui.editor.Editor
// (not inherited from Editor)
PrzypisEditor.classes = {
    hide: 'annotator-hide',
    focus: 'annotator-focus'
};

// Template with a slot for React component
PrzypisEditor.template = [
    '<div class="annotator-outer annotator-editor annotator-hide">',
    '  <div id="react-form-slot"></div>',
    '</div>'
].join('\n');


PrzypisEditor.options = {
    onSave: null,
    onCancel: null
};