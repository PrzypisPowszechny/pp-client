declare module 'annotator' {
  export const App: {
    new (): AppInstance;
  }

  export interface AppInstance {
    include(obj: any);
    start(): void;
  }

  export namespace storage {
    export const debug;
  }

  export namespace util {
    export const $: JQueryStatic;
    export function mousePosition(event);
  }

  export namespace ui {

    export namespace widget {

      export interface IWidgetOptions {
        appendTo: 'string';
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
