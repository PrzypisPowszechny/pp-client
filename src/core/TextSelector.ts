import { Range } from 'xpath-range';
import $ from 'jquery';
import _isEqual from 'lodash/isEqual';
import { PPHighlightClass } from 'class_consts';
// More on xpath-range here: https://github.com/opengovfoundation/xpath-range
// Wondering what's inside? See https://github.com/opengovfoundation/xpath-range/blob/master/src/range.coffee#L227
import { SerializedRangeWithText } from '../utils/annotations';

const TEXTSELECTOR_NS = 'pp-textselector';

/**
 * TextSelector monitors a document (or a specific element) for text selections
 * and can notify another object of a selection event
 *
 * It is PP's adaptation of annotator's TextSelectors
 */

/*
 * IMPORTANT NOTE on SELECTION RANGES
 * We leave annotator's TextSelector more or less as it is;
 * It can handle all kinds of selection (also multi-range selection). Although our application further assumes that
 * no more than one range can be selected for an annotation, there is no reason to stop supporting it at such an early
 * stage. If we ever stumble across multi-range selections it will be clear based on TextSelectors output
 * (rather than exceptions).
 */

function hasClassParents(element, selector: string) {
  const elAndParents = $(element).parents().addBack();
  return (elAndParents.filter(selector).length !== 0);
}

export type SelectionCallback = (
  selectionRangeWithText: SerializedRangeWithText[],
  isInsideArticle: boolean,
  event: any,
) => void;

export interface TextSelectorOptions {
  onMouseUp?: SelectionCallback;
  onSelectionChange?: SelectionCallback;
  outsideArticleClasses?: string[];
}

export default class TextSelector {
  document: Document;
  element: Element;
  onMouseUp: SelectionCallback;
  onSelectionChange: SelectionCallback;
  outsideArticleSelector: string;
  lastRanges: SerializedRangeWithText[];

  constructor(
    element: Element,
    options: TextSelectorOptions,
  ) {
    /*
     * onMouseUp - called on every mouseUp event, passing current selection;
     * onSelectionChange - called only when the selection has changed
     */
    this.element = element;
    options = options || {};
    this.onMouseUp = options.onMouseUp;
    this.onSelectionChange = options.onSelectionChange;
    // an OR selector to match any of the classes external to the article
    this.outsideArticleSelector = (options.outsideArticleClasses || []).map(cls => `.${cls}`).join(', ');
    this.lastRanges = null;

    if (this.element.ownerDocument) {
      this.document = this.element.ownerDocument;

      $(this.document.body).on(`mouseup.${TEXTSELECTOR_NS}`, this.checkForEndSelection);
    } else {
      console.warn(`You created an instance of the TextSelector on an element
       that doesn't have an ownerDocument. This won't work! Please ensure the element is added
       to the DOM before the plugin is configured:`, this.element);
    }
  }

  destroy = () => {
    if (this.document) {
      $(this.document.body).off(`.${TEXTSELECTOR_NS}`);
    }
  }

  /**
   * Public: capture the current selection from the document, excluding any nodes
   * that fall outside of the adder's `element`.
   *
   * Returns an Array of NormalizedRange instances.
   */
  captureDocumentSelection = () => {
    const ranges = [];
    const rangesToIgnore = [];
    const selection = window.getSelection();

    if (selection.isCollapsed) {
      return [];
    }

    for (let i = 0; i < selection.rangeCount; i++) {
      const r = selection.getRangeAt(i);
      /*
       TODO we could try to remove the dependency on `Range` (xpath-range) library, but that
       would require writing our own tool for this kind of logic
       */
      const browserRange = new Range.BrowserRange(r);
      const normedRange = browserRange.normalize().limit(this.element);
      /*
       If the new range falls fully outside our this.element, we should
       add it back to the document but not return it from this method.
       */
      if (normedRange === null) {
        rangesToIgnore.push(r);
      } else {
        ranges.push(normedRange);
      }
    }

    /*
     BrowserRange#normalize() modifies the DOM structure and deselects the
     underlying text as a result. So here we remove the selected ranges and
     reapply the new ones.
     */
    selection.removeAllRanges();

    rangesToIgnore.forEach(selection.addRange);

    // Add normed ranges back to the selection
    for (const range of ranges) {
      const nativeRange = this.document.createRange();

      nativeRange.setStartBefore(range.start);
      nativeRange.setEndAfter(range.end);
      selection.addRange(nativeRange);
    }

    return ranges;
  }

  currentSerializedSelection = () => {
    const selectedRanges = this.captureDocumentSelection();
    return this.serializeRanges(selectedRanges);
  }

  serializeRanges = (ranges: Range.NormalizedRange[]) => {
    const serializedRanges = [];
    for (const range of ranges) {
      serializedRanges.push({
        range: range.serialize(this.element, `.${PPHighlightClass}`),
        text: range.text(),
      });
    }
    return serializedRanges;
  }

  currentSingleSelectionCenter = () => {
    /*
     * We assume only a single selection is made
     * Return null if less or more than one selection range is made
     */
    const selection = window.getSelection();
    if (selection.rangeCount !== 1) {
      return null;
    }
    const selectionBox = selection.getRangeAt(0).getBoundingClientRect();
    const x = window.scrollX + selectionBox.left + selectionBox.width / 2;
    const y = window.scrollY + selectionBox.top + selectionBox.height / 2;
    return {
      x,
      y,
    };
  }

  /**
   * Event callback: called when the mouse button is released. Checks to see if a
   * selection has been made
   *
   * event - A mouseup Event object.
   *
   * Returns nothing.
   */
  checkForEndSelection = (event) => {

    // Get the currently selected ranges.
    const selectedRanges = this.captureDocumentSelection();

    let isInsideArticle = true;

    // If any part of the selection is outside the article, classify the selection as outside the article
    for (const selectedRange of selectedRanges) {
      let container = selectedRange.commonAncestor;
      if ($(container).hasClass(PPHighlightClass)) {
        container = $(container).parents(`[class!=${PPHighlightClass}]`)[0];
      }
      if (!this.isInsideArticle(container)) {
        isInsideArticle = false;
      }
    }

    const serializedRanges = this.serializeRanges(selectedRanges);

    if (this.onSelectionChange) {
      if (!_isEqual(serializedRanges, this.lastRanges)) {
        this.onSelectionChange(serializedRanges, isInsideArticle, event);
      }
    }
    if (this.onMouseUp) {
      this.onMouseUp(serializedRanges, isInsideArticle, event);
    }
    this.lastRanges = serializedRanges;
  }

  /*
  * isInsideArticle determines if the provided element is a part of the article itself or outside the article. Useful
  * for ignoring mouse actions on the very PP elements or belonging to any other browser extension
  *
  * element - An Element or TextNode to check.
  */
  isInsideArticle(element) {
    return !hasClassParents(element, this.outsideArticleSelector);
  }
}
