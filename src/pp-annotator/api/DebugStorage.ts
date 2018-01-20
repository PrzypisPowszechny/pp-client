import IAnnotation from './Annotation.interface';
import Registry from '../modules/Registry';
import IStorage from './Storage.interface';
import IModule from '../modules/Module.interface';

import IPPSettings from 'src/PPSettings.interface';
declare const PP_SETTINGS: IPPSettings;

// id generator function from old annotator storage
const generateId = (() => {
  let counter = -1;
  return () => counter += 1;
})();

export default class DebugStorage implements IStorage, IModule {
  annotations: IAnnotation[] = [];

  trace(action: string, data: any) {
    console.debug(`DebugStorage: invoking action ${action} on data: `, data);
    // If some annotations are hardcoded, print an annotation json to facilitate copying it manually to the file
    if (PP_SETTINGS.READ_ANNOTATIONS_FROM_FILE) {
      console.debug('Annotation json:');
      console.debug(JSON.stringify(data));
    }
  }

  create(annotation: IAnnotation): IAnnotation {
    if (!annotation.id) {
      annotation.id = generateId();
    }
    this.trace('create', annotation);

    this.annotations = this.annotations.concat(annotation);
    return annotation;
  }

  update(annotation: IAnnotation): IAnnotation {
    this.trace('update', annotation);

    this.delete(annotation);
    return this.create(annotation);
  }

  delete(annotation: IAnnotation): IAnnotation {
    this.trace('delete', annotation);

    const deleted = this.query(annotation.id);
    this.annotations = this.annotations.filter(ann => ann.id !== annotation.id);

    return deleted;
  }

  query(id: string | number): IAnnotation {
    this.trace('query', id);

    return this.annotations.find(annotation => annotation.id === id) as IAnnotation;
  }

  configure(registry: Registry) {
    registry.registerUtility(this, 'storage');
  }
}
