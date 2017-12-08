import IStorage from './Storage.interface';
import IAnnotation from './Annotation.interface';

export default class DebugStorage implements IStorage {
  annotations: IAnnotation[] = [];

  create(data: any): any {
    this.annotations = this.annotations.concat(data);
    return this.annotations;
  }

  update(id: number, data: IAnnotation): IAnnotation[] {
    this.remove(id);
    return this.create(data);
  }

  remove(id: number): IAnnotation[] {
    this.annotations = [
      ...this.annotations.filter(ann => ann.id !== id),
    ];

    return this.annotations;
  }

  get(id: number): any {
    return this.annotations.find(annotation => annotation.id === id);
  }

}
