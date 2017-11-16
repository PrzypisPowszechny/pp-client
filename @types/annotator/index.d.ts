declare module 'annotator' {
  export const App: {
    new (): AppInstance;
  }

  export interface AppInstance {
    include(obj: any): void;
    start(): void;
    registry: registry.Registry;
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

    export namespace highlighter {
      export const Highlighter: {
        new (element: Element): {}
      }
    }
    export namespace textselector {
      export const TextSelector: {
        new (element: Element, options: {
          onSelection(ranges: Array<{}>, event: JQuery.Event): void;
        }): {};
      }
    }

    export namespace widget {

      export interface IWidgetOptions {
        appendTo?: 'string';
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
