import annotator, { IAnnotation, util } from 'annotator';

import EditorWidget from '../editor/EditorWidget';
import MenuWidget from '../MenuWidget';
import ViewerWidget from '../viewer/ViewerWidget';
import AnnotationViewModel from '../annotation/AnnotationViewModel';
import IAnnotationAPIModel from '../annotation/IAnnotationAPIModel';
import App from './App';
import IModule from './Module.interface';

// const { highlighter, textselector } = ui;

/**
 * trim strips whitespace from either end of a string.
 *
 * This usually exists in native code, but not in IE8.
 */
function trim(s: string) {
  if (typeof String.prototype.trim === 'function') {
    return String.prototype.trim.call(s);
  } else {
    return s.replace(/^[\s\xA0]+|[\s\xA0]+$/g, '');
  }
}

/**
 * rangesParser returns a function that can be used to construct an
 * annotation from a list of selected ranges.
 */
function rangesParser(contextEl: Element, ignoreSelector: string) {
  return (ranges: JQuery.PlainObject) => {
    const text = [];
    const serializedRanges = [];

    for (let i = 0, len = ranges.length; i < len; i++) {
      const r = ranges[i];
      text.push(trim(r.text()));
      serializedRanges.push(r.serialize(contextEl, ignoreSelector));
    }

    return {
      quote: text.join(' / '),
      ranges: serializedRanges,
    };
  };
}

/**
 * maxZIndex returns the maximum z-index of all elements in the provided set.
 */
function maxZIndex(elements: Element[]) {
  let max = -1;
  for (let i = 0, len = elements.length; i < len; i++) {
    const $el = util.$(elements[i]);
    if ($el.css('position') !== 'static') {
      // Use parseFloat since we may get scientific notation for large
      // values.
      const zIndex = parseFloat($el.css('z-index'));
      if (zIndex > max) {
        max = zIndex;
      }
      }
    }

  return max;
}

/**
 * Helper function to inject CSS into the page that ensures Annotator elements
 * are displayed with the highest z-index.
 */
function injectDynamicStyle() {
  util.$('#annotator-dynamic-style').remove();

  const sel =
    '*' +
    ':not(annotator-adder)' +
    ':not(annotator-outer)' +
    ':not(annotator-notice)' +
    ':not(annotator-filter)';

  // use the maximum z-index in the page
  let max = maxZIndex(util.$(document.body).find(sel).get());

  // but don't go smaller than 1010, because this isn't bulletproof --
  // dynamic elements in the page (notifications, dialogs, etc.) may well
  // have high z-indices that we can't catch using the above method.
  max = Math.max(max, 1000);

  const rules = [
    '.annotator-adder, .annotator-outer, .annotator-notice {',
    '  z-index: ' + (max + 20) + ';',
    '}',
    '.annotator-filter {',
    '  z-index: ' + (max + 10) + ';',
    '}',
  ].join('\n');

  util
    .$('<style>' + rules + '</style>')
    .attr('id', 'annotator-dynamic-style')
    .attr('type', 'text/css')
    .appendTo('head');
}

/**
 * Helper function to remove dynamic stylesheets
 */
function removeDynamicStyle() {
  util.$('#annotator-dynamic-style').remove();
}

interface IOptions {
  element?: Element;
}

/**
 * pp annotator ui module (almost unchanged annotator.ui.main)
 */
export default class PPUI implements IModule {
  readonly parseRanges: any;
  readonly element: any;

  // Application state variables
  appStarted: boolean;
  highlighter: annotator.ui.highlighter.Highlighter;
  interactionPoint: annotator.util.IPosition | null;
  menu: MenuWidget;
  editor: EditorWidget;
  textselector: annotator.ui.textselector.TextSelector;
  viewer: ViewerWidget;
  embeddedHighlights: { [id: number]: AnnotationViewModel };

  constructor(options?: IOptions) {
    if (typeof options === 'undefined' || options === null) {
      options = {};
    }
    this.element = options.element || document.body;
    this.parseRanges = rangesParser(this.element, '.annotator-hl');
    this.appStarted = false;
  }

  start(app: App) {
    /*
      Highlighting and text selection detection
     */
    this.highlighter = new annotator.ui.highlighter.Highlighter(this.element);

    this.textselector = new annotator.ui.textselector.TextSelector(this.element, {
      onSelection: (ranges, event) => {
        if (!this.appStarted) {
          throw new Error('App not initialized!');
        }
        if (!this.editor.isShown() && ranges.length > 0) {
          const url = window.location.href;
          const annotation = AnnotationViewModel.fromSelection(this.parseRanges(ranges), url);
          this.interactionPoint = util.mousePosition(event);
          this.menu.load(annotation, this.interactionPoint);
        } else {
          this.menu.hide();
        }
      },
    });

    /*
      Visible (embodied) components
     */
    this.menu = new MenuWidget({
      beginAnnotationCreate: (annotation) => {
        if (!this.appStarted) {
          throw new Error('App not initialized!');
        }
        if (this.interactionPoint === null) {
          throw new Error('Interaction point is null!');
        }
        this.editor.load(annotation, this.interactionPoint,
          (resultAnnotation: AnnotationViewModel) =>
            app.annotations.create(
              AnnotationViewModel.toModel(resultAnnotation) as IAnnotation,
            ),
        );
      },
    });

    this.viewer = new ViewerWidget({
      onEdit: (annotation) => {
        if (!this.appStarted) {
          throw new Error('App is not initialized!');
        }
        // Copy the interaction point from the shown viewer:
        const interactionPoint = util.$(this.viewer.element).css(['top', 'left']);
        this.interactionPoint = (interactionPoint as any) as { top: number; left: number };

        this.editor.load(annotation, this.interactionPoint,
          (resultAnnotation: AnnotationViewModel) =>
            app.annotations.update(AnnotationViewModel.toModel(resultAnnotation) as IAnnotation),
        );
      },
      onDelete(annotation) {
        app.annotations.delete(annotation);
      },
      autoViewHighlights: this.element,
    });

    this.editor = new EditorWidget();

    this.embeddedHighlights = {};
    this.interactionPoint = null;

    this.menu.attach();
    this.editor.attach();
    this.viewer.attach();
    injectDynamicStyle();
    this.appStarted = true;
  }

  destroy() {
    if (!this.appStarted) {
      throw new Error('App not initialized!');
    }
    this.highlighter.destroy();
    this.textselector.destroy();
    this.menu.destroy();
    this.editor.destroy();
    this.viewer.destroy();
    removeDynamicStyle();
  }

  annotationsLoaded(anns: IAnnotationAPIModel[]) {
    if (!this.appStarted) {
      throw new Error('App not initialized!');
    }

    const annViewModels = anns.map(ann => new AnnotationViewModel(ann));
    this.embeddedHighlights = {};
    for (const viewModel of annViewModels) {
      this.embeddedHighlights[viewModel.id] = viewModel;
    }
    this.highlighter.drawAll(annViewModels as IAnnotation[]);
  }

  annotationCreated(ann: IAnnotationAPIModel) {
    if (!this.appStarted) {
      throw new Error('App not initialized!');
    }
    const viewModel = new AnnotationViewModel(ann);
    this.embeddedHighlights[viewModel.id] = viewModel;
    this.highlighter.draw(viewModel);
  }

  annotationDeleted(ann: IAnnotationAPIModel) {
    if (!this.appStarted) {
      throw new Error('App not initialized!');
    }
    this.highlighter.undraw(this.embeddedHighlights[ann.id as number]);
  }

  annotationUpdated(ann: IAnnotationAPIModel) {
    if (!this.appStarted) {
      throw new Error('App not initialized!');
    }
    this.highlighter.redraw(this.embeddedHighlights[ann.id as number]);
  }
}
