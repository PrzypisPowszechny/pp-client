import IAnnotation from './Annotation.interface';

export default interface IStorage {
  create(data: IAnnotation): IAnnotation[];
  update(id: number, data: IAnnotation): IAnnotation[];
  delete(id: number): IAnnotation[];
  query(id: number): IAnnotation;
}
