"use strict";

var Widget = require('annotator').ui.widget.Widget;
var util = require('annotator').util;

// annotator jquery for consistency
var $ = util.$;

var NS = 'przypis-adder';


// Adder shows and hides an annotation adder button that can be clicked on to
// create an annotation.

// PrzypisAdder is for the most part a copy of annotator.Adder, except with two buttons, thus:
// onCreate callback replaced with beginAnnotationCreate and beforeRequestCreate

var PrzypisAdder = Widget.extend({

    constructor: function (options) {
        Widget.call(this, options);

        this.ignoreMouseup = false;
        this.annotation = null;

        this.beginAnnotationCreate = this.options.beginAnnotationCreate;
        this.beforeRequestCreate = this.options.beforeRequestCreate;

        var self = this;
        this.element
            .on("click." + NS, 'button', function (e) {
                self._onClick(e);
            })
            .on("mousedown." + NS, 'button', function (e) {
                self._onMousedown(e);
            });

        this.document = this.element[0].ownerDocument;
        $(this.document.body).on("mouseup." + NS, function (e) {
            self._onMouseup(e);
        });
    },

    destroy: function () {
        this.element.off("." + NS);
        $(this.document.body).off("." + NS);
        Widget.prototype.destroy.call(this);
    },

    // Public: Load an annotation and show the adder.
    //
    // annotation - An annotation Object to load.
    // position - An Object specifying the position in which to show the editor
    //            (optional).
    //
    // If the user clicks on the adder with an annotation loaded, the onCreate
    // handler will be called. In this way, the adder can serve as an
    // intermediary step between making a selection and creating an annotation.
    //
    // Returns nothing.
    load: function (annotation, position) {
        this.annotation = annotation;
        this.show(position);
    },

    // Public: Show the adder.
    //
    // position - An Object specifying the position in which to show the editor
    //            (optional).
    //
    // Examples
    //
    //   adder.show()
    //   adder.hide()
    //   adder.show({top: '100px', left: '80px'})
    //
    // Returns nothing.
    show: function (position) {
        if (typeof position !== 'undefined' && position !== null) {
            this.element.css({
                top: position.top,
                left: position.left
            });
        }
        Widget.prototype.show.call(this);
    },

    // Event callback: called when the mouse button is depressed on the adder.
    //
    // event - A mousedown Event object
    //
    // Returns nothing.
    _onMousedown: function (event) {
        // Do nothing for right-clicks, middle-clicks, etc.
        if (event.which > 1) {
            return;
        }

        event.preventDefault();
        // Prevent the selection code from firing when the mouse button is
        // released
        this.ignoreMouseup = true;
    },

    // Event callback: called when the mouse button is released
    //
    // event - A mouseup Event object
    //
    // Returns nothing.
    _onMouseup: function (event) {
        // Do nothing for right-clicks, middle-clicks, etc.
        if (event.which > 1) {
            return;
        }

        // Prevent the selection code from firing when the ignoreMouseup flag is
        // set
        if (this.ignoreMouseup) {
            event.stopImmediatePropagation();
        }
    },

    // Event callback: called when the adder is clicked. The click event is used
    // as well as the mousedown so that we get the :active state on the adder
    // when clicked.
    //
    // event - A mousedown Event object
    //
    // Returns nothing.
    _onClick: function (event) {
        // Do nothing for right-clicks, middle-clicks, etc.
        if (event.which > 1) {
            return;
        }

        event.preventDefault();

        // Hide the adder
        this.hide();
        this.ignoreMouseup = false;


        if (this.annotation !== null) {
            // create annotation button clicked
            if (event.target == this.element.find(".create-annotation")[0]) {
                if (typeof this.beginAnnotationCreate === 'function') {
                    this.beginAnnotationCreate(this.annotation, event);
                }
            }

            // create request button clicked
            if (event.target == this.element.find(".create-request")[0]) {
                if (typeof this.beforeRequestCreate === 'function') {
                    this.beforeRequestCreate(this.annotation, event);
                }
            }
        }

    }
});

// original annotator style removed (bare buttons)
// '<div class="annotator-adder annotator-hide">',

PrzypisAdder.template = [
    '<div class="annotator-hide">',
    '  <button type="button" class="create-annotation"> Dodaj przypis </button>',
    '  <button type="button" class="create-request"> Poproś o źródło </button>',
    '</div>'
].join('\n');

// Configuration options
PrzypisAdder.options = {
    // Callback, called when the user clicks the adder when an
    // annotation is loaded.
    beginAnnotationCreate: null,
    beforeRequestCreate: null
};


exports.PrzypisAdder = PrzypisAdder;
