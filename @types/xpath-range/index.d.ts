// Based on https://github.com/opengovfoundation/xpath-range/blob/master/src/range.coffee#L227

declare module 'xpath-range' {
  export namespace Range {

    export class Range {
      startContainer: Text;
      startOffset: number;
      endContainer: Text;
      endOffset: number;
    }

    export class BrowserRange {
      commonAncestorContainer: Element;
      startContainer: Text;
      startOffset: number;
      endContainer: Text;
      endOffset: number;
    }

    export class NormalizedRange {
      commonAncestor: Element;
      start: Text;
      end: Text;

      serialize(contextElement: Element, ignoreSelector?: string): SerializedRange;
      /*
        contextElement: according to xpath comments: "A root Element from which to anchor the serialisation."
        ignoreSelector: according to xpath comments: "A selector String of elements to ignore. For example
          elements injected by the annotator". In other words, element no to account for when calculating selection
          offset (e.g. volatile spans created by other annotations)
       */
    }

    export class SerializedRange {
      start: string;
      startOffset: number;
      end: string;
      endOffset: number;
    }
  }
}
