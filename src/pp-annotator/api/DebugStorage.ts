import IAnnotation from './Annotation.interface';
import Registry from '../modules/Registry';
import IStorage from './Storage.interface';
import IModule from '../modules/Module.interface';

// id generator function from old annotator storage
const generateId = (() => {
  let counter = -1;
  return () => counter += 1;
})();

export default class DebugStorage implements IStorage, IModule {
  annotations: IAnnotation[] = [];

  create(annotation: IAnnotation): IAnnotation {
    if (annotation.id === undefined) {
      annotation.id = generateId();
    }
    this.annotations = this.annotations.concat(annotation);
    return annotation;
  }

  update(annotation: IAnnotation): IAnnotation {
    this.delete(annotation);
    // this.annotations = this.annotations.concat(annotation);
    return this.create(annotation);
  }

  delete(annotation: IAnnotation): IAnnotation {
    console.log(this.annotations);
    const deleted = this.annotations[annotation.id];
    this.annotations = [
      ...this.annotations.filter(ann => ann.id !== annotation.id),
    ];

    return deleted;
  }

  query(id: number): IAnnotation {
    return this.annotations.find(annotation => annotation.id === id) as IAnnotation;
  }

  configure(registry: Registry) {
    registry.registerUtility(this, 'storage');
  }
}