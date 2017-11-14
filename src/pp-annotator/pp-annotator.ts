import PrzypisEditor from './form/PrzypisEditor';
import PrzypisAdder from './PrzypisAdder';
import PrzypisViewer from './viewer/PrzypisViewer';


import * as annotator from 'annotator';
const { util, ui: PPUI } = annotator;
const { highlighter, textselector } = PPUI;

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
 * annotationFactory returns a function that can be used to construct an
 * annotation from a list of selected ranges.
 */
function annotationFactory(contextEl, ignoreSelector) {
    return function (ranges) {
        const text = [],
            serializedRanges = [];

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
function maxZIndex(elements) {
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

    const sel = '*' +
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
        ".annotator-adder, .annotator-outer, .annotator-notice {",
        "  z-index: " + (max + 20) + ";",
        "}",
        ".annotator-filter {",
        "  z-index: " + (max + 10) + ";",
        "}"
    ].join("\n");

    util.$('<style>' + rules + '</style>')
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

/**
 * pp annotator ui module (almost unchanged annotator.ui.main)
 */
export function ui(options) {
    if (typeof options === 'undefined' || options === null) {
        options = {};
    }

    options.element = options.element || document.body;
    options.editorExtensions = options.editorExtensions || [];
    options.viewerExtensions = options.viewerExtensions || [];

    // Local helpers
    console.log(typeof (annotationFactory));
    const makeAnnotation = annotationFactory(options.element, '.annotator-hl');

    // Object to hold local state
    const s = {
        interactionPoint: null,
        adder: null,
        editor: null,
        highlighter: null,
        textselector: null,
        viewer: null,
    };

    function start(app) {
        const ident = app.registry.getUtility('identityPolicy');
        const authz = app.registry.getUtility('authorizationPolicy');

        s.adder = new PrzypisAdder({
            beginAnnotationCreate: function (annotation) {
                s.editor.load(annotation, s.interactionPoint)
                    .then(function (annotation) {
                        app.annotations.create(annotation);
                    })
                    .catch(() => {}); // When the annotation form is cancelled

            },
            beforeRequestCreate: function () {
                //TODO what happens when the adder's request button is clicked
            }
        });
        s.adder.attach();

        //Use PrzypisEditor instead of standard annotator.ui.Editor
        s.editor = new PrzypisEditor({
            extensions: options.editorExtensions
        });
        s.editor.attach();

        s.highlighter = new highlighter.Highlighter(options.element);

        s.textselector = new textselector.TextSelector(options.element, {
            onSelection: function (ranges, event) {
                if (ranges.length > 0) {
                    const annotation = makeAnnotation(ranges);
                    s.interactionPoint = util.mousePosition(event);
                    s.adder.load(annotation, s.interactionPoint);
                } else {
                    s.adder.hide();
                }
            }
        });

        s.viewer = new PrzypisViewer({
            onEdit: function (annotation) {
                // Copy the interaction point from the shown viewer:
                s.interactionPoint = util.$(s.viewer.element).css(['top', 'left']);

                s.editor.load(annotation, s.interactionPoint)
                    .then(function (annotation) {
                        app.annotations.update(annotation);
                    })
                    .catch(() => {}); // When the annotation form is cancelled
            },
            onDelete: function (ann) {
                app.annotations['delete'](ann);
            },
            permitEdit: function (ann) {
                return authz.permits('update', ann, ident.who());
            },
            permitDelete: function (ann) {
                return authz.permits('delete', ann, ident.who());
            },
            autoViewHighlights: options.element,
            extensions: options.viewerExtensions
        });
        s.viewer.attach();

        injectDynamicStyle();
    }

    return {
        start: start,

        destroy: function () {
            s.adder.destroy();
            s.editor.destroy();
            s.highlighter.destroy();
            s.textselector.destroy();
            s.viewer.destroy();
            removeDynamicStyle();
        },

        annotationsLoaded: function (anns) {
            s.highlighter.drawAll(anns);
        },
        annotationCreated: function (ann) {
            s.highlighter.draw(ann);
        },
        annotationDeleted: function (ann) {
            s.highlighter.undraw(ann);
        },
        annotationUpdated: function (ann) {
            s.highlighter.redraw(ann);
        },

        /**
         Editor#load returns a promise that is resolved if editing
         completes, and rejected if editing is cancelled. We return it
         here to "stall" the annotation process until the editing is
         done.
         */
        /*
        beforeAnnotationCreated: function (annotation) {
            return s.editor.load(annotation, s.interactionPoint);
        },

        beforeAnnotationUpdated: function (annotation) {
            return s.editor.load(annotation, s.interactionPoint);
        }
        */
    };
}
