import React from 'react';
import ReactDOM from "react-dom";

import AnnotationForm from './form.jsx';

// Annotator base classes
import { util, ui as PPUI } from 'annotator';

const Widget = PPUI.widget.Widget;

// The same dependencies as annotator's for consistency (at least for now)
const {$, Promise} = util;

// TODO remove?
// const NS = "przypis-editor";


/* TODO remove?
// preventEventDefault copied from annotator.ui.editor
function preventEventDefault(event) {
    if (typeof event !== 'undefined' &&
        event !== null &&
        typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
}
*/


// ANNOTATOR FUNCTIONS (copied from annotator.ui.editor)

/**
 * dragTracker is a function which allows a callback to track changes made to
 * the position of a draggable "handle" element.
 *
 * handle - A DOM element to make draggable
 * callback - Callback function
 *
 * Callback arguments:
 *
 * delta - An Object with two properties, "x" and "y", denoting the amount the
 * mouse has moved since the last (tracked) call.
 *
 * Callback returns: Boolean indicating whether to track the last movement. If
 * the movement is not tracked, then the amount the mouse has moved will be
 * accumulated and passed to the next mousemove event.
 */
export function dragTracker(handle, callback) {
    let lastPos = null,
        throttled = false;

    // Event handler for mousemove
    function mouseMove(e) {
        if (throttled || lastPos === null) {
            return;
        }

        const delta = {
            y: e.pageY - lastPos.top,
            x: e.pageX - lastPos.left
        };

        let trackLastMove = true;
        // The callback function can return false to indicate that the tracker
        // shouldn't keep updating the last position. This can be used to
        // implement "walls" beyond which (for example) resizing has no effect.
        if (typeof callback === 'function') {
            trackLastMove = callback(delta);
        }

        if (trackLastMove !== false) {
            lastPos = {
                top: e.pageY,
                left: e.pageX
            };
        }

        // Throttle repeated mousemove events
        throttled = true;
        setTimeout(function () {
            throttled = false;
        }, 1000 / 60);
    }

    // Event handler for mouseup
    function mouseUp() {
        lastPos = null;
        $(handle.ownerDocument)
            .off('mouseup', mouseUp)
            .off('mousemove', mouseMove);
    }

    // Event handler for mousedown -- starts drag tracking
    function mouseDown(e) {
        if (e.target !== handle) {
            return;
        }

        lastPos = {
            top: e.pageY,
            left: e.pageX
        };

        $(handle.ownerDocument)
            .on('mouseup', mouseUp)
            .on('mousemove', mouseMove);

        e.preventDefault();
    }

    // Public: turn off drag tracking for this dragTracker object.
    function destroy() {
        $(handle).off('mousedown', mouseDown);
    }

    $(handle).on('mousedown', mouseDown);

    return {destroy: destroy};
}


/**
 * resizer is a component that uses a dragTracker under the hood to track the
 * dragging of a handle element, using that motion to resize another element.
 *
 * element - DOM Element to resize
 * handle - DOM Element to use as a resize handle
 * options - Object of options.
 *
 * Available options:
 *
 * invertedX - If this option is defined as a function, and that function
 * returns a truthy value, the horizontal sense of the drag will be
 * inverted. Useful if the drag handle is at the left of the
 * element, and so dragging left means "grow the element"
 * invertedY - If this option is defined as a function, and that function
 * returns a truthy value, the vertical sense of the drag will be
 * inverted. Useful if the drag handle is at the bottom of the
 * element, and so dragging down means "grow the element"
 */
export function resizer(element, handle, options) {
    const $el = $(element);
    if (typeof options === 'undefined' || options === null) {
        options = {};
    }

    // Translate the delta supplied by dragTracker into a delta that takes
    // account of the invertedX and invertedY callbacks if defined.
    function translate(delta) {
        let directionX = 1,
            directionY = -1;

        if (typeof options.invertedX === 'function' && options.invertedX()) {
            directionX = -1;
        }
        if (typeof options.invertedY === 'function' && options.invertedY()) {
            directionY = 1;
        }

        return {
            x: delta.x * directionX,
            y: delta.y * directionY
        };
    }

    // Callback for dragTracker
    function resize(delta) {
        const height = $el.height(),
            width = $el.width(),
            translated = translate(delta);

        if (Math.abs(translated.x) > 0) {
            $el.width(width + translated.x);
        }
        if (Math.abs(translated.y) > 0) {
            $el.height(height + translated.y);
        }

        // Did the element dimensions actually change? If not, then we've
        // reached the minimum size, and we shouldn't track
        return ($el.height() !== height || $el.width() !== width);
    }

    // We return the dragTracker object in order to expose its methods.
    return dragTracker(handle, resize);
}


/**
 * mover is a component that uses a dragTracker under the hood to track the
 * dragging of a handle element, using that motion to move another element.
 *
 * element - DOM Element to move
 * handle - DOM Element to use as a move handle
 */
export function mover(element, handle) {
    function move(delta) {
        $(element).css({
            top: parseInt($(element).css('top'), 10) + delta.y,
            left: parseInt($(element).css('left'), 10) + delta.x
        });
    }

    // We return the dragTracker object in order to expose its methods.
    return dragTracker(handle, move);
}


/**
 * annotator.ui.editor.Editor extension
 * - without Editor field add and load mechanism (and React-rendered form)
 *
 * Css and show/hide functionality of the outer editor container is nevertheless inherited.
 */
export const PrzypisEditor = Widget.extend({
    /**
     * calls directly Widget, which is Editor's prototype
     */
    constructor: function (options) {
        Widget.call(this, options);

        this.onSave = this.options.onSave;
        this.onCancel = this.options.onCancel;

        this.fields = [];
        this.annotation = {};

        // jquery mouse action listeners from annotator module have been left out;
        // see annotator.ui.editor's constructor
    },

    /**
     * Returns an unresolved Promise that will be resolved when the save/cancel button is clicked.
     * If load function is waited upon, it will finish only when the save/cancel button is clicked.
     */
    load: function (annotation, position) {
        this.annotation = annotation;
        this.updateForm(annotation.fields);

        function onSuccess(resolve, reject) {
            this.dfd = {resolve: resolve, reject: reject};
            this.show(position);
        }

        return new Promise(onSuccess.bind(this));
    },

    /**
     * Renders (or updates, if already rendered) React component within the Editor html container
     */
    updateForm: function (fields) {
        //When save button is clicked, react form field value dictionary will be passed to this function
        const save = function (fields) {
            // Load field values from component props
            this.annotation.fields = fields;

            // Resolve deferred promise; will result in asynchronous user input
            if (typeof this.dfd !== 'undefined' && this.dfd !== null) {
                this.dfd.resolve(this.annotation);
            }
            this.hide();
        }.bind(this);

        ReactDOM.render(
            <AnnotationForm fields={fields || {}} onSave={save} onCancel={this.cancel.bind(this)}/>,
            document.getElementById('react-form-slot')
        );
    },

    /**
     * Public: Cancels the editing process, discarding any edits made to the
     * annotation.
     *
     * Returns itself.
     */
    cancel: function () {
        if (typeof this.dfd !== 'undefined' && this.dfd !== null) {
            this.dfd.reject('editing cancelled');
        }
        this.hide();
    },


    /**
     * Public: Show the editor.
     *
     * position - An Object specifying the position in which to show the editor
     * (optional).
     *
     * Examples
     *
     * editor.show()
     * editor.hide()
     * editor.show({top: '100px', left: '80px'})
     *
     * Returns nothing.
     */
    show: function (position) {
        if (typeof position !== 'undefined' && position !== null) {
            this.element.css({
                top: position.top,
                left: position.left
            });
        }

        this.element
            .find('.annotator-save')
            .addClass(this.classes.focus);

        Widget.prototype.show.call(this);

        // give main textarea focus
        this.element.find(":input:first").focus();

        this._setupDraggables();
    },


    /**
     * Override parent attach function to render React form
     */
    attach: function () {
        // Call parent function (renders PrzypisEditor.template)
        Widget.prototype.attach.call(this);
        this.updateForm({});
    },

    /**
     * Sets up mouse events for resizing and dragging the editor window.
     *
     * Returns nothing.
     */
    _setupDraggables: function () {
        if (typeof this._resizer !== 'undefined' && this._resizer !== null) {
            this._resizer.destroy();
        }
        if (typeof this._mover !== 'undefined' && this._mover !== null) {
            this._mover.destroy();
        }

        this.element.find('.annotator-resize').remove();

        // Find the first/last item element depending on orientation
        let cornerItem;
        if (this.element.hasClass(this.classes.invert.y)) {
            cornerItem = this.element.find('.annotator-item:last');
        } else {
            cornerItem = this.element.find('.annotator-item:first');
        }

        if (cornerItem) {
            $('<span class="annotator-resize"></span>').appendTo(cornerItem);
        }

        const controls = this.element.find('.annotator-controls')[0],
            textarea = this.element.find('textarea:first')[0],
            resizeHandle = this.element.find('.annotator-resize')[0];

        this._resizer = resizer(textarea, resizeHandle, {
            invertedX: function () {
                return this.element.hasClass(this.classes.invert.x);
            }.bind(this),

            invertedY: function () {
                return this.element.hasClass(this.classes.invert.y);
            }.bind(this)
        });

        this._mover = mover(this.element[0], controls);
    }
});


// Copied from annotator.ui.editor.Editor
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

// Defaults
PrzypisEditor.options = {
    onSave: null,
    onCancel: null
};
