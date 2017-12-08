import IAnnotation from './Annotation.interface';

export default interface IStorage {
  create(data: IAnnotation): IAnnotation[];
  update(id: number, data: IAnnotation): IAnnotation[];
  remove(id: number): IAnnotation[];
  get(id: number): IAnnotation;
}
