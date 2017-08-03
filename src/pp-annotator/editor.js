
var Editor = require('annotator').ui.editor.Editor;
var Widget = require('annotator').ui.widget.Widget;
var util = require('annotator').util;


var $ = util.$;
var _t = util.gettext;
var Promise = util.Promise;

var NS = "annotator-editor";

/*
annotator.ui.editor.Editor extension with different
-html template
-fields

Much of original editor functionality is nevertheless inherited.
 */
var PrzypisEditor = exports.PrzypisEditor = Editor.extend({

    // Copied Editor.constructor that calls directly Widget, which is Editor's prototype
    constructor: function (options) {
        // ignore Editor.constructor
        Widget.call(this, options);

        this.fields = [];
        this.annotation = {};

        if (this.options.defaultFields) {
        this.addField({
            type: 'textarea',
            label: 'Komentarz',
            load: function (field, annotation) {
                $(field).find('textarea').val(annotation.text || '');
            },
            submit: function (field, annotation) {
                annotation.text = $(field).find('textarea').val();
            }
        });
        }

        var self = this;

        this.element
            .on("submit." + NS, 'form', function (e) {
                self._onFormSubmit(e);
            })
            .on("click." + NS, '.annotator-save', function (e) {
                self._onSaveClick(e);
            })
            .on("click." + NS, '.annotator-cancel', function (e) {
                self._onCancelClick(e);
            })
            .on("mouseover." + NS, '.annotator-cancel', function (e) {
                self._onCancelMouseover(e);
            })
            .on("keydown." + NS, 'textarea', function (e) {
                self._onTextareaKeydown(e);
            });
    }
});


// Copied from annotator.ui.editor.Editor
// (not inherited from Editor)
PrzypisEditor.classes = {
    hide: 'annotator-hide',
    focus: 'annotator-focus'
};

// Copied from annotator.ui.editor.Editor
// (not inherited from Editor)
PrzypisEditor.template = [
    '<div class="annotator-outer annotator-editor annotator-hide">',
    '  <form class="annotator-widget">',
    '    <ul class="annotator-listing"></ul>',
    '    <div class="annotator-controls">',
    '     <a href="#cancel" class="annotator-cancel"> Anuluj </a>',
    '      <a href="#save"',
    '         class="annotator-save annotator-focus"> Zapisz </a>',
    '    </div>',
    '  </form>',
    '</div>'
].join('\n');

// Copied from annotator.ui.editor.Editor
// (not inherited from Editor)
PrzypisEditor.options = {
    // Add the default field(s) to the editor.
    defaultFields: true
};
