import React from 'react';
import ReactDOM from "react-dom";

import AnnotationMultipleViewer from './AnnotationMultipleViewer.jsx';

import { ui, util } from 'annotator';

const { widget: { Widget } } = ui;

const { $ } = util;


// Public: Creates an element for viewing annotations.
export default class PrzypisViewer extends Widget {
  NS = 'annotator-viewer';

    // Public: Creates an instance of the Viewer object.
    //
    // options - An Object containing options.
    //
    // Examples
    //
    //   # Creates a new viewer, adds a custom field and displays an annotation.
    //   viewer = new Viewer()
    //   viewer.load(annotation)
    //
    // Returns a new Viewer instance.
    constructor(options) {
        super(options);

        this.annotations = [];
        this.hideTimer = null;
        this.hideTimerDfd = null;
        this.hideTimerActivity = null;
        this.mouseDown = false;

        var self = this;

        if (typeof this.options.onEdit !== 'function') {
            throw new TypeError("onEdit callback must be a function");
        }
        if (typeof this.options.onDelete !== 'function') {
            throw new TypeError("onDelete callback must be a function");
        }
        if (typeof this.options.permitEdit !== 'function') {
            throw new TypeError("permitEdit callback must be a function");
        }
        if (typeof this.options.permitDelete !== 'function') {
            throw new TypeError("permitDelete callback must be a function");
        }

        if (this.options.autoViewHighlights) {
            this.document = this.options.autoViewHighlights.ownerDocument;

            $(this.options.autoViewHighlights)
                .on("mouseover." + this.NS, '.annotator-hl', function (event) {
                    // If there are many overlapping highlights, still only
                    // call _onHighlightMouseover once.
                    if (event.target === this) {
                        self._onHighlightMouseover(event);
                    }
                })
                .on("mouseleave." + this.NS, '.annotator-hl', function () {
                    self._startHideTimer();
                });

            $(this.document.body)
                .on("mousedown." + this.NS, function (e) {
                    if (e.which === 1) {
                        self.mouseDown = true;
                    }
                })
                .on("mouseup." + this.NS, function (e) {
                    if (e.which === 1) {
                        self.mouseDown = false;
                    }
                });
        }

        this.element
            .on("mouseenter." + this.NS, function () {
                self._clearHideTimer();
            })
            .on("mouseleave." + this.NS, function () {
                self._startHideTimer();
            });
    }

    destroy() {
        if (this.options.autoViewHighlights) {
            $(this.options.autoViewHighlights).off("." + this.NS);
            $(this.document.body).off("." + this.NS);
        }
        this.element.off("." + this.NS);
        super.destroy();
    }

    // Public: Show the viewer.
    //
    // position - An Object specifying the position in which to show the editor
    //            (optional).
    //
    // Examples
    //
    //   viewer.show()
    //   viewer.hide()
    //   viewer.show({top: '100px', left: '80px'})
    //
    // Returns nothing.
    show (position) {
        if (typeof position !== 'undefined' && position !== null) {
            this.element.css({
                top: position.top,
                left: position.left
            });
        }

        var controls = this.element
            .find('.annotator-controls')
            .addClass(this.classes.showControls);

        var self = this;
        setTimeout(function () {
            controls.removeClass(self.classes.showControls);
        }, 500);

        super.show();
    }


    update = (annotations) => {
        // Callbacks to pass to React component
        const callbacks = {
            onEdit: this._onEditClick,
            onDelete: this._onDeleteClick,
        };

        ReactDOM.render(
          <AnnotationMultipleViewer annotations={annotations} callbacks={callbacks}/>,
          document.getElementById('react-annotation-viewer-slot')
        );
    }

    // Public: Load annotations into the viewer and show it.
    //
    // annotation - An Array of annotations.
    //
    // Examples
    //
    //   viewer.load([annotation1, annotation2, annotation3])
    //
    // Returns nothing.
    load = (annotations, position) => {
        this.annotations = annotations || [];
        this.update(annotations);
        this.show(position);
    }

    // Event callback: called when the edit button is clicked.
    //
    // event - An Event object.
    //
    // Returns nothing.
    _onEditClick = (event, annotation) => {
        this.hide();
        this.options.onEdit(annotation);
    }

    // Event callback: called when the delete button is clicked.
    //
    // event - An Event object.
    //
    // Returns nothing.
    _onDeleteClick = (event, annotation)=>  {
        this.hide();
        this.options.onDelete(annotation);
    }

    // Event callback: called when a user triggers `mouseover` on a highlight
    // element.
    //
    // event - An Event object.
    //
    // Returns nothing.
    _onHighlightMouseover = (event) => {
        // If the mouse button is currently depressed, we're probably trying to
        // make a selection, so we shouldn't show the viewer.
        if (this.mouseDown) {
            return;
        }

        var self = this;
        this._startHideTimer(true)
            .done(function () {
                var annotations = $(event.target)
                    .parents('.annotator-hl')
                    .addBack()
                    .map(function (_, elem) {
                        return $(elem).data("annotation");
                    })
                    .toArray();

                // Now show the viewer with the wanted annotations
                self.load(annotations, util.mousePosition(event));
            });
    }

    // Starts the hide timer. This returns a promise that is resolved when the
    // viewer has been hidden. If the viewer is already hidden, the promise will
    // be resolved instantly.
    //
    // activity - A boolean indicating whether the need to hide is due to a user
    //            actively indicating a desire to view another annotation (as
    //            opposed to merely mousing off the current one). Default: false
    //
    // Returns a Promise.
    _startHideTimer = (activity) => {
        if (typeof activity === 'undefined' || activity === null) {
            activity = false;
        }

        // If timer has already been set, use that one.
        if (this.hideTimer) {
            if (activity === false || this.hideTimerActivity === activity) {
                return this.hideTimerDfd;
            } else {
                // The pending timeout is an inactivity timeout, so likely to be
                // too slow. Clear the pending timeout and start a new (shorter)
                // one!
                this._clearHideTimer();
            }
        }

        var timeout;
        if (activity) {
            timeout = this.options.activityDelay;
        } else {
            timeout = this.options.inactivityDelay;
        }

        this.hideTimerDfd = $.Deferred();

        if (!this.isShown()) {
            this.hideTimer = null;
            this.hideTimerDfd.resolve();
            this.hideTimerActivity = null;
        } else {
            var self = this;
            this.hideTimer = setTimeout(function () {
                self.hide();
                self.hideTimerDfd.resolve();
                self.hideTimer = null;
            }, timeout);
            this.hideTimerActivity = Boolean(activity);
        }

        return this.hideTimerDfd.promise();
    }

    // Clears the hide timer. Also rejects any promise returned by a previous
    // call to _startHideTimer.
    //
    // Returns nothing.
    _clearHideTimer = () => {
        clearTimeout(this.hideTimer);
        this.hideTimer = null;
        this.hideTimerDfd.reject();
        this.hideTimerActivity = null;
    }
}

// Classes for toggling annotator state.
PrzypisViewer.classes = {
    showControls: 'annotator-visible'
};

// HTML templates for this.widget and this.item properties.
PrzypisViewer.template = [
    '<div class="annotator-outer annotator-viewer annotator-hide">',
    '  <div id="react-annotation-viewer-slot"></div>',
    '</div>'
].join('\n');

// Configuration options
PrzypisViewer.options = {
    // Add the default field(s) to the viewer.
    defaultFields: true,

    // Time, in milliseconds, before the viewer is hidden when a user mouses off
    // the viewer.
    inactivityDelay: 500,

    // Time, in milliseconds, before the viewer is updated when a user mouses
    // over another annotation.
    activityDelay: 100,

    // Hook, passed an annotation, which determines if the viewer's "edit"
    // button is shown. If it is not a function, the button will not be shown.
    permitEdit: function () { return false; },

    // Hook, passed an annotation, which determines if the viewer's "delete"
    // button is shown. If it is not a function, the button will not be shown.
    permitDelete: function () { return false; },

    // If set to a DOM Element, will set up the viewer to automatically display
    // when the user hovers over Annotator highlights within that element.
    autoViewHighlights: null,

    // Callback, called when the user clicks the edit button for an annotation.
    onEdit: function () {},

    // Callback, called when the user clicks the delete button for an
    // annotation.
    onDelete: function () {}
};
