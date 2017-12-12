import IAnnotation from './Annotation.interface';
import Registry from '../modules/Registry';
import IStorage from './Storage.interface';
import IModule from '../modules/Module.interface';

export default class DebugStorage implements IStorage, IModule {
  annotations: IAnnotation[] = [];

  create(data: any): any {
    this.annotations = this.annotations.concat(data);
    return this.annotations;
  }

  update(id: number, data: IAnnotation): IAnnotation[] {
    this.delete(id);
    return this.create(data);
  }

  delete(id: number): IAnnotation[] {
    this.annotations = [
      ...this.annotations.filter(ann => ann.id !== id),
    ];

    return this.annotations;
  }

  query(id: number): any {
    return this.annotations.find(annotation => annotation.id === id);
  }

  configure(registry: Registry) {
    registry.registerUtility(this, 'storage');
  }
}
