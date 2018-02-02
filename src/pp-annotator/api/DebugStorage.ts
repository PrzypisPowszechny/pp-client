import Registry from '../modules/Registry';
import IStorage from './Storage.interface';
import IModule from '../modules/Module.interface';

import IPPSettings from 'src/PPSettings.interface';
import {IAnnotationAPIModel} from '../annotation/IAnnotationAPIModel';
declare const PP_SETTINGS: IPPSettings;

// id generator function from old annotator storage
const generateId = (() => {
  let counter = 0;
  return () => counter += 1;
})();

export default class DebugStorage implements IStorage, IModule {
  annotations: IAnnotationAPIModel[] = [];

  trace(action: string, data: any) {
    console.debug(`DebugStorage: invoking action ${action} on data: `, data);
    // If some annotations are hardcoded, print an annotation json to facilitate copying it manually to the file
    if (PP_SETTINGS.READ_ANNOTATIONS_FROM_FILE) {
      console.debug('Annotation json:');
      console.debug(JSON.stringify(data));
    }
  }

  create(annotation: IAnnotationAPIModel): IAnnotationAPIModel {
    if (!annotation.id) {
      annotation.id = generateId();
    }
    this.trace('create', annotation);

    this.annotations = this.annotations.concat(annotation);
    return annotation;
  }

  update(annotation: IAnnotationAPIModel): IAnnotationAPIModel {
    this.trace('update', annotation);

    this.delete(annotation);
    return this.create(annotation);
  }

  delete(annotation: IAnnotationAPIModel): IAnnotationAPIModel {
    this.trace('delete', annotation);
    const deleted = this.query(annotation.id);
    this.annotations = this.annotations.filter(ann => ann.id !== annotation.id);
    return deleted[0];
  }

  query(id?: number): IAnnotationAPIModel[] {
    if (id !== undefined) {
      return this.annotations.filter(ann => ann.id === id);
    }
    // return all annotations
    return this.annotations.slice();
  }

  configure(registry: Registry) {
    registry.registerUtility(this, 'storage');
  }
}
