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
    annotations: {
      create(ann: IAnnotation): void;
      update(ann: IAnnotation): void;
      delete(ann: IAnnotation): void;
    };
    include(obj: any): void;
    start(): void;
  }

  export namespace registry {
    export class Registry {
      public getUtility(utilityName: string): any;
    }
  }

  export namespace storage {
    export const debug: {};
  }

  export namespace util {
    export const $: JQueryStatic;
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
        public drawAll(anns: IAnnotation[]): void;
        public draw(ann: IAnnotation): void;
        public undraw(ann: IAnnotation): void;
        public redraw(ann: IAnnotation): void;
      }
    }
    export namespace textselector {
      export class TextSelector extends widget.Widget {
        constructor(
          element: Element,
          options: {
            onSelection(ranges: Array<{}>, event: JQuery.Event): void;
          }
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
        public static classes: {
          hide: string;
          invert: {
            x: string;
            y: string;
          };
        };
        public static template: string;
        public static options: IWidgetOptions;
        public element: JQuery;
        constructor(options: IWidgetOptions);
        public show(position?: util.IPosition): void;
        public hide(): void;
        public attach(): void;
        public destroy(): void;
        public isShown(): boolean;
      }
    }
  }
}
