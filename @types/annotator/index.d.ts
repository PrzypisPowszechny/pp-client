/* tslint:disable: max-classes-per-file */
declare module 'annotator' {
  export const App: {
    new (): IAppInstance;
  };

  // A basic type, used as an API model as well as withing the client application
  export interface IAnnotation {
    ranges: any[];
    quote: string;
  }

  export interface IAppInstance {
    registry: registry.Registry;
    notify: (message: string, severity: string) => any;
    annotations: storage.IAnnotationStorage;
    include(obj: any): void;
    start(): void;
  }

  export namespace registry {
    export class Registry {
      getUtility(utilityName: string): any;
      registerUtility(component: any, iface: string): void; // TODO type better
    }
  }

  export namespace storage {
    export interface IAnnotationXHR extends JQuery.jqXHR {
      _action?: string;
      _id?: number | string;
    }

    export interface IHttpStorageOptions {
      emulateHTTP?: boolean;
      emulateJSON?: boolean;
      headers?: any;
      prefix?: string;
      urls?: any;
      onError?(msg: string, xhr: IAnnotationXHR): any;
    }

    export interface IAnnotationStorage {
      create(ann: any): void;
      update(ann: any): void;
      delete(ann: any): void;
      query(ann: any): void;
    }

    export const debug: {};
    export const noop: {};
    export const http: {};
  }

  export namespace util {
    export const $: JQueryStatic;
    export const Promise: any;
    export const gettext: any;
    export interface IPosition {
      top: number;
      left: number;
    }
    export function mousePosition(event: JQuery.Event): IPosition;
  }

  export namespace ui {
    export interface IAnnotationLoader extends widget.Widget {
      load(ann: any, position: util.IPosition): JQuery.Deferred<any>;
    }

    export namespace highlighter {
      export class Highlighter extends widget.Widget {
        constructor(element: Element);
        drawAll(anns: IAnnotation[]): void;
        draw(ann: IAnnotation): void;
        undraw(ann: IAnnotation): void;
        redraw(ann: IAnnotation): void;
      }
    }
    export namespace textselector {
      export class TextSelector extends widget.Widget {
        constructor(
          element: Element,
          options: {
            onSelection(ranges: Array<{}>, event: JQuery.Event): void;
          },
        );
      }
    }

    export namespace widget {
      export interface IWidgetOptions {
        appendTo?: 'string';
        extensions?: Array<{}>;
      }

      export interface IWidgetConstructor {
        new (options: IWidgetOptions): Widget;
      }

      export class Widget {
        static classes: {
          hide: string;
          invert: {
            x: string;
            y: string;
          };
          [key: string]: any;
        };
        static template: string;
        static options: IWidgetOptions;
        element: JQuery;
        constructor(options: IWidgetOptions);
        show(position?: util.IPosition): void;
        hide(): void;
        attach(): void;
        destroy(): void;
        isShown(): boolean;
      }
    }
  }
}
