declare module 'annotator' {
  export const App: {
    new (): AppInstance;
  }

  export interface IAnnotation {
    id: number;
    quote: string;
    ranges: any[]; // TODO type this better
    fields: {
      [x: string]: any;
    }
  }

  export interface AppInstance {
    include(obj: any): void;
    start(): void;
    registry: registry.Registry;
    annotations: {
      create(ann: IAnnotation): void;
      update(ann: IAnnotation): void;
      delete(ann: IAnnotation): void;
    }
  }

  export namespace registry {
    export class Registry {
      getUtility(utilityName: string): any;
    }
  }

  export namespace storage {
    export const debug: {};
  }

  export namespace util {
    export const $: JQueryStatic;
    export function mousePosition(event: JQuery.Event): {
      top: number;
      left: number;
    };
  }

  export namespace ui {

    export interface IAnnotationLoader extends widget.Widget {
      load(ann: IAnnotation, position: {
        top: number,
        left: number,
      }): JQuery.Deferred<IAnnotation>;
    }

    export namespace highlighter {
      export class Highlighter extends widget.Widget {
        constructor (element: Element);
        drawAll(anns: IAnnotation[]): void;
        draw(ann: IAnnotation): void;
        undraw(ann: IAnnotation): void;
        redraw(ann: IAnnotation): void;
      }
    }
    export namespace textselector {
      export class TextSelector extends widget.Widget {
        constructor(element: Element, options: {
          onSelection(ranges: Array<{}>, event: JQuery.Event): void;
        });
      }
    }

    export namespace widget {

      export interface IWidgetOptions {
        appendTo?: 'string';
        extensions?: {}[];
      }

      export interface IWidgetConstructor {
        new (options: IWidgetOptions): Widget;
      }

      export class Widget {
        element: JQuery;
        static classes: {
          hide: string;
          invert: {
            x: string;
            y: string;
          }
        };
        static template: string;
        static options: IWidgetOptions;
        constructor(options: IWidgetOptions);
        show(position?: {
          top: number;
          left: number;
        }): void;
        hide(): void;
        attach(): void;
        destroy(): void;
        isShown(): boolean;
      }

    }

  }

}
