declare module 'annotator' {
  export const App: {
    new (): AppInstance;
  }

  export interface AppInstance {
    include(obj: any): void;
    start(): void;
  }

  export namespace storage {
    export const debug: {};
  }

  export namespace util {
    export const $: JQueryStatic;
    export function mousePosition(event: JQueryMouseEventObject): {
      top: number;
      left: number;
    };
  }

  export namespace ui {

    export namespace highlighter {
      export const Highlighter: {
        new (element: HTMLElement): {}
      }
    }
    export namespace textselector {
      export const TextSelector: {
        new (element: HTMLElement, options: {
          onSelection(ranges, event): void;
        }): {};
      }
    }

    export namespace widget {

      export interface IWidgetOptions {
        appendTo: 'string';
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
        show(position?): void;
        hide(): void;
        attach(): void;
        destroy(): void;
        isShown(): boolean;
      }

    }

  }

}
