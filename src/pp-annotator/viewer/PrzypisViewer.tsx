import React from 'react';
import ReactDOM from 'react-dom';
import annotator, { ui, util } from 'annotator';

import AnnotationMultipleViewer from './AnnotationMultipleViewer';
import { AnnotationViewModel } from '../annotation';

const { widget: { Widget } } = ui;

const { $ } = util;

interface IPrzypisViewerOptions extends annotator.ui.widget.IWidgetOptions {
  defaultFields?: boolean;
  inactivityDelay?: number;
  activityDelay?: number;
  permitEdit?: (ann?: AnnotationViewModel) => boolean;
  permitDelete?: (ann?: AnnotationViewModel) => boolean;
  autoViewHighlights?: Node;
  onEdit?: (annotation: AnnotationViewModel) => void;
  onDelete?: (annotation: AnnotationViewModel) => void;
}

// Public: Creates an element for viewing annotations.
export default class PrzypisViewer extends Widget {
  static nameSpace = 'annotator-viewer';
  static classes = {
    ...Widget.classes,
    showControls: 'annotator-visible',
  };

  annotations: AnnotationViewModel[];
  private hideTimer: number | null;
  private hideTimerDfd: JQuery.Deferred<any> | null;
  private hideTimerActivity: boolean;
  private mouseDown: boolean;
  private options: IPrzypisViewerOptions;
  private document: Document;
  private onEditCallback: (annotation: AnnotationViewModel) => void;
  private onDeleteCallback: (annotation: AnnotationViewModel) => void;

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
  constructor(options: IPrzypisViewerOptions) {
    super(options);

    this.annotations = [];
    this.hideTimer = null;
    this.hideTimerDfd = null;
    this.hideTimerActivity = false;
    this.mouseDown = false;

    if (typeof this.options.onEdit !== 'function') {
      throw new TypeError('onEdit callback must be a function');
    }
    if (typeof this.options.onDelete !== 'function') {
      throw new TypeError('onDelete callback must be a function');
    }
    if (typeof this.options.permitEdit !== 'function') {
      throw new TypeError('permitEdit callback must be a function');
    }
    if (typeof this.options.permitDelete !== 'function') {
      throw new TypeError('permitDelete callback must be a function');
    }

    this.onEditCallback = this.options.onEdit;
    this.onDeleteCallback = this.options.onDelete;

    const self = this;

    if (this.options.autoViewHighlights) {
      this.document = this.options.autoViewHighlights.ownerDocument;

      $(this.options.autoViewHighlights)
        .on('mouseover.' + PrzypisViewer.nameSpace, '.annotator-hl', function onMouseOver(event) {
          // If there are many overlapping highlights, still only
          // call onHighlightMouseover once.
          if (event.target === this) {
            self.onHighlightMouseover(event);
          }
        })
        .on('mouseleave.' + PrzypisViewer.nameSpace, '.annotator-hl', () => {
          self.startHideTimer(false);
        });

      $(this.document.body)
        .on('mousedown.' + PrzypisViewer.nameSpace, (e) => {
          if (e.which === 1) {
            this.mouseDown = true;
          }
        })
        .on('mouseup.' + PrzypisViewer.nameSpace, (e) => {
          if (e.which === 1) {
            this.mouseDown = false;
          }
        });
    }

    this.element
      .on('mouseenter.' + PrzypisViewer.nameSpace, () => {
        self.clearHideTimer();
      })
      .on('mouseleave.' + PrzypisViewer.nameSpace, () => {
        self.startHideTimer(false);
      });
  }

  destroy() {
    if (this.options.autoViewHighlights) {
      $(this.options.autoViewHighlights).off('.' + PrzypisViewer.nameSpace);
      $(this.document.body).off('.' + PrzypisViewer.nameSpace);
    }
    this.element.off('.' + PrzypisViewer.nameSpace);
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
  show(position: annotator.util.IPosition) {
    if (typeof position !== 'undefined' && position !== null) {
      this.element.css({
        top: position.top,
        left: position.left,
      });
    }

    super.show();
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
  load(annotations: AnnotationViewModel[], position: annotator.util.IPosition) {
    this.annotations = annotations || [];
    this.update(annotations);
    this.show(position);
  }

  /**
   * Renders (or updates, if already rendered) React component within the PrzypisViewer html container
   */
  update(annotations: AnnotationViewModel[]) {
    // Callbacks to pass to React component
    const callbacks = {
      onEdit: this.onEditClick,
      onDelete: this.onDeleteClick,
    };

    ReactDOM.render(
      <AnnotationMultipleViewer annotations={annotations} callbacks={callbacks}/>,
        this.element.find('.react-annotation-viewer-slot')[0]
    );
  }

  onEditClick = (_: any, annotation: AnnotationViewModel) => {
    this.hide();
    this.onEditCallback(annotation);
  }

  onDeleteClick = (_: any, annotation: AnnotationViewModel) => {
    this.hide();
    this.onDeleteCallback(annotation);
  }

  // Event callback: called when a user triggers `mouseover` on a highlight
  // element.
  //
  // event - An Event object.
  //
  // Returns nothing.
  onHighlightMouseover(event: JQuery.Event) {
    // If the mouse button is currently depressed, we're probably trying to
    // make a selection, so we shouldn't show the viewer.
    if (this.mouseDown) {
      return;
    }
    this.startHideTimer(true).done(() => {
      const annotations = $(event.target)
        .parents('.annotator-hl')
        .addBack()
        .map((_, elem) => $(elem).data('annotation'))
        .toArray();

      // Now show the viewer with the wanted annotations
      this.load((annotations as any) as AnnotationViewModel[], util.mousePosition(event));
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
  startHideTimer(activity: boolean) {
    /*todo KG
     This part is copied straight from annotator.Viewer and might not be very consistent with other code;
     We should consider refactoring it and making it more explicit if we need to modify it
     */

    // If timer has already been set, use that one.
    if (this.hideTimer) {
      if (activity === false || this.hideTimerActivity === activity) {
        // the code is so spaghetti that we just have to assert
        // typescript this will not be null here
        return (this.hideTimerDfd as JQuery.Deferred<any>).promise();
      } else {
        // The pending timeout is an inactivity timeout, so likely to be
        // too slow. Clear the pending timeout and start a new (shorter)
        // one!
        this.clearHideTimer();
      }
    }

    let timeout;
    if (activity) {
      timeout = this.options.activityDelay;
    } else {
      timeout = this.options.inactivityDelay;
    }

    this.hideTimerDfd = $.Deferred();

    if (!this.isShown()) {
      this.hideTimer = null;
      this.hideTimerDfd.resolve();
      this.hideTimerActivity = false;
    } else {
      this.hideTimer = setTimeout(() => {
        this.hide();
        if (this.hideTimerDfd) {
          this.hideTimerDfd.resolve();
        }
        this.hideTimer = null;
      }, timeout);
      this.hideTimerActivity = Boolean(activity);
    }

    return this.hideTimerDfd.promise();
  }

  // Clears the hide timer. Also rejects any promise returned by a previous
  // call to startHideTimer.
  //
  // Returns nothing.
  clearHideTimer() {
    if (!this.hideTimer || !this.hideTimerDfd || this.hideTimerActivity) {
      throw new Error('Expected timer to be initialized!');
    }
    clearTimeout(this.hideTimer);
    this.hideTimer = null;
    this.hideTimerDfd.reject();
    this.hideTimerActivity = false;
  }
}

// HTML templates for this.widget and this.item properties.
PrzypisViewer.template = [
  '<div class="annotator-outer annotator-viewer annotator-hide">',
  '  <div class="react-annotation-viewer-slot"></div>',
  '</div>'
].join('\n');

// Configuration options
Object.assign(PrzypisViewer.options, {
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
  permitEdit() {
    return false;
  },

  // Hook, passed an annotation, which determines if the viewer's "delete"
  // button is shown. If it is not a function, the button will not be shown.
  permitDelete() {
    return false;
  },

  // If set to a DOM Element, will set up the viewer to automatically display
  // when the user hovers over Annotator highlights within that element.
  autoViewHighlights: null,

  // Callback, called when the user clicks the edit button for an annotation.
  onEdit: () => undefined,

  // Callback, called when the user clicks the delete button for an
  // annotation.
  onDelete: () => undefined,
});
