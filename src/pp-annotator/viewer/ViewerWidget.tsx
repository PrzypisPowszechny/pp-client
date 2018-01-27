import React from 'react';
import ReactDOM from 'react-dom';
import annotator, { ui, util } from 'annotator';

import AnnotationViewModel from '../annotation/AnnotationViewModel';
import ViewerContent from './ViewerContent';

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
export default class ViewerWidget extends Widget {
  static nameSpace = 'pp-viewer-widget';
  static classes = {
    ...Widget.classes,
    hide: 'pp-hide',
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
  private position: annotator.util.IPosition;

  /*
    Note: visibility is mostly any Widget's domain.
    Widget is an annotator module class and we're not "forking" it into ours just yet
    TODO This should be done as soon as possible
   */
  private visible: boolean;
  get isVisible(): boolean {
    return this.visible;
  }

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
  constructor(options?: IPrzypisViewerOptions) {
    super(options || {});

    this.annotations = [];
    this.hideTimer = null;
    this.hideTimerDfd = null;
    this.hideTimerActivity = false;
    this.mouseDown = false;
    this.visible = false;
    this.position = null;

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
        .on('mouseover.' + ViewerWidget.nameSpace, '.annotator-hl', function onMouseOver(event) {
          // If there are many overlapping highlights, still only
          // call onHighlightMouseover once.
          if (event.target === this) {
            self.onHighlightMouseover(event);
          }
        })
        .on('mouseleave.' + ViewerWidget.nameSpace, '.annotator-hl', () => {
          self.startHideTimer(false);
        });

      $(this.document.body)
        .on('mousedown.' + ViewerWidget.nameSpace, (e) => {
          if (e.which === 1) {
            this.mouseDown = true;
          }
        })
        .on('mouseup.' + ViewerWidget.nameSpace, (e) => {
          if (e.which === 1) {
            this.mouseDown = false;
          }
        });
    }

    this.element
      .on('mouseenter.' + ViewerWidget.nameSpace, () => {
        self.clearHideTimer();
      })
      .on('mouseleave.' + ViewerWidget.nameSpace, () => {
        self.startHideTimer(false);
      });
  }

  destroy() {
    if (this.options.autoViewHighlights) {
      $(this.options.autoViewHighlights).off('.' + ViewerWidget.nameSpace);
      $(this.document.body).off('.' + ViewerWidget.nameSpace);
    }
    this.element.off('.' + ViewerWidget.nameSpace);
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
    this.visible = true;
  }

  /*
  TODO: see the note at `visible` declaration
 */
  hide() {
    super.hide();
    this.visible = false;
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
    this.position = position;
  }

  /**
   * Renders (or updates, if already rendered) React component within the ViewerWidget html container
   */
  update(annotations: AnnotationViewModel[]) {
    // Callbacks to pass to React component
    const callbacks = {
      onEdit: this.onEditClick,
      onDelete: this.onDeleteClick,
    };

    ReactDOM.render(
      <ViewerContent annotations={annotations} callbacks={callbacks}/>,
      this.element.get(0), // underlying DOM element
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

  areAnnotationsSame(annotationsOne: AnnotationViewModel[], annotationsTwo: AnnotationViewModel[]) {
    function eqSet(as, bs) {
      if (as.size !== bs.size) {
        return false;
      }
      for (const a of as) {
        if (!bs.has(a)) {
          return false;
        }
      }
      return true;
    }

    const idsOne = new Set(annotationsOne.map(ann => ann.id));
    const idsTwo = new Set(annotationsTwo.map(ann => ann.id));
    return eqSet(idsOne, idsTwo);
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
    // PP modification:
    // If the window is already open or far away enough, don't display it again;
    let mousePosition = util.mousePosition(event);
    this.startHideTimer(true).done(() => {
      const annotations = $(event.target)
        .parents('.annotator-hl')
        .addBack()
        .map((_, elem) => $(elem).data('annotation'))
        .toArray();
      // If the annotations displayed the last time are the same, display the window at the very same position.
      // Prevent window from wobbling, when the user briefly moves the pointer outside the highlighted area and returns
      // todo: use some kind of timer so that the window "fixation" period lasts only a split second
      // It's good enough for now, though
      if (this.areAnnotationsSame((annotations as any) as AnnotationViewModel[], this.annotations)) {
        mousePosition = this.position;
      }
      // Now show the viewer with the wanted annotations
      this.load((annotations as any) as AnnotationViewModel[], mousePosition);
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
ViewerWidget.template = [
  '<div class="pp-ui pp-outer pp-viewer-widget pp-hide">',
  '</div>',
].join('\n');

// Configuration options
Object.assign(ViewerWidget.options, {
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
