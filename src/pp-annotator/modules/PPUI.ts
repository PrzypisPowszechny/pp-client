import annotator, { IAnnotation, ui, util } from 'annotator';

import EditorWidget from '../editor/EditorWidget';
import MenuWidget from '../MenuWidget';
import ViewerWidget from '../viewer/ViewerWidget';
import AnnotationViewModel from '../annotation/AnnotationViewModel';
import IAnnotationAPIModel from '../annotation/IAnnotationAPIModel';
import App from './App';
import IModule from './Module.interface';

const { highlighter, textselector } = ui;

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
 * KG todo probably needs to account for some edge cases
 */
function injectDynamicStyle() {
  util.$('#pp-dynamic-style').remove();

  const classesToUp = [
      '.pp-adder',
      '.pp-viewer',
      '.pp-editor',
  ];
  // Semantic UI's modal's z-index as for the actual version
  const semanticUiModalZIndex = 1000;

  const sel = '* ' +
      classesToUp.map( cls => ':not(' + cls + ') ' );

  // use the maximum z-index in the page
  let max = maxZIndex(util.$(document.body).find(sel).get());

  // but don't go smaller than 1010, because this isn't bulletproof --
  // dynamic elements in the page (notifications, dialogs, etc.) may well
  // have high z-indices that we can't catch using the above method.
  max = Math.max(max, 1000);

  /*
    KG: do not set absolute z-indexes, but rather increment them
    to maintain relationships between many components' z-indexes
  */
  let rules = classesToUp.map(selector =>
  selector + ' { z-index: ' + (parseInt(util.$(selector).first().css('z-index')) + max) as string + ' !important; }',
  ).join('\n');

  // Special hardwired rule for semantic ui's modals, that are not rendered yet;
  rules += [
    '.ui.modals.dimmer { ',
    'z-index: ' + (semanticUiModalZIndex + max) + ' !important;',
    '}'
  ].join('\n');

  util
    .$('<style>' + rules + '</style>')
    .attr('id', 'pp-dynamic-style')
    .attr('type', 'text/css')
    .appendTo('head');
}

/**
 * Helper function to remove dynamic stylesheets
 */
function removeDynamicStyle() {
  util.$('#pp-dynamic-style').remove();
}

interface IState {
  interactionPoint: annotator.util.IPosition | null;
  adder: MenuWidget;
  editor: EditorWidget;
  highlighter: annotator.ui.highlighter.Highlighter;
  textselector: annotator.ui.textselector.TextSelector;
  viewer: ViewerWidget;
  embeddedHighlights: { [id: number]: AnnotationViewModel };
}

interface IOptions {
  element?: Element;
  editorExtensions?: Array<{}>;
  viewerExtensions?: Array<{}>;
}

/**
 * pp annotator ui module (almost unchanged annotator.ui.main)
 */
export default class PPUI implements IModule {
  state: IState | undefined;
  editorExtensions: any;
  viewerExtensions: any;
  parseRanges: any;
  element: any;

  constructor(options?: IOptions) {
    if (typeof options === 'undefined' || options === null) {
      options = {};
    }

    this.element = options.element || document.body;
    this.editorExtensions = options.editorExtensions || [];
    this.viewerExtensions = options.viewerExtensions || [];

    // Local helpers
    this.parseRanges = rangesParser(this.element, '.annotator-hl');
  }

  start(app: App) {
    const parseRanges = this.parseRanges;

    const state: IState = this.state = {
      embeddedHighlights: {},
      interactionPoint: null,
      adder: new MenuWidget({
        beginAnnotationCreate(annotation) {
          if (!state) {
            throw new Error('App not initialized!');
          }
          if (state.interactionPoint === null) {
            throw new Error('Interaction point is null!');
          }
          state.editor.load(annotation, state.interactionPoint,
            (resultAnnotation: AnnotationViewModel) =>
              app.annotations.create(
                AnnotationViewModel.toModel(resultAnnotation) as IAnnotation,
              ),
          );
        },
        beforeRequestCreate() {
          // TODO what happens when the adder's request button is clicked
        },
      }),
      editor: new EditorWidget({
        extensions: this.editorExtensions,
      }),
      highlighter: new highlighter.Highlighter(this.element),
      textselector: new textselector.TextSelector(this.element, {
        onSelection(ranges, event) {
          if (!state) {
            throw new Error('App not initialized!');
          }

          if (ranges.length > 0) {
            const url = window.location.href;
            const annotation = AnnotationViewModel.fromSelection(parseRanges(ranges), url);
            state.interactionPoint = util.mousePosition(event);
            state.adder.load(annotation, state.interactionPoint);
          } else {
            state.adder.hide();
          }
        },
      }),
      viewer: new ViewerWidget({
        onEdit(annotation) {
          if (!state) {
            throw new Error('App is not initialized!');
          }
          // Copy the interaction point from the shown viewer:
          const interactionPoint = util.$(state.viewer.element).css(['top', 'left']);
          state.interactionPoint = (interactionPoint as any) as { top: number; left: number };

          state.editor.load(annotation, state.interactionPoint,
            (resultAnnotation: AnnotationViewModel) =>
              app.annotations.update(AnnotationViewModel.toModel(resultAnnotation) as IAnnotation),
          );
        },
        onDelete(annotation) {
          app.annotations.delete(annotation);
        },
        autoViewHighlights: this.element,
        extensions: this.viewerExtensions,
      }),
    };
    this.state.adder.attach();
    this.state.editor.attach();
    this.state.viewer.attach();
    injectDynamicStyle();
  }

  destroy() {
    if (!this.state) {
      throw new Error('App not initialized!');
    }
    this.state.adder.destroy();
    this.state.editor.destroy();
    this.state.highlighter.destroy();
    this.state.textselector.destroy();
    this.state.viewer.destroy();
    removeDynamicStyle();
  }

  annotationsLoaded(anns: IAnnotationAPIModel[]) {
    if (!this.state) {
      throw new Error('App not initialized!');
    }

    const annVieModels = anns.map(ann => new AnnotationViewModel(ann));
    this.state.embeddedHighlights = {};
    for (const viewModel of annVieModels) {
      this.state.embeddedHighlights[viewModel.id] = viewModel;
    }
    this.state.highlighter.drawAll(anns as IAnnotation[]);
  }

  annotationCreated(ann: IAnnotationAPIModel) {
    if (!this.state) {
      throw new Error('App not initialized!');
    }
    const viewModel = new AnnotationViewModel(ann);
    this.state.embeddedHighlights[viewModel.id] = viewModel;
    this.state.highlighter.draw(viewModel);
  }

  annotationDeleted(ann: IAnnotationAPIModel) {
    if (!this.state) {
      throw new Error('App not initialized!');
    }
    this.state.highlighter.undraw(this.state.embeddedHighlights[ann.id as number]);
  }

  annotationUpdated(ann: IAnnotationAPIModel) {
    if (!this.state) {
      throw new Error('App not initialized!');
    }
    this.state.highlighter.redraw(this.state.embeddedHighlights[ann.id as number]);
  }
}
